import Course from "../models/course";
import CoursesService from "./courses-service";
import { Observable, from, Observer } from "rxjs"
import ErrorCode from "../models/common/error-code";
import { CompatClient, Stomp } from "@stomp/stompjs";
import SockJS from 'sockjs-client';
import { AUTH_TOKEN } from "./courses-service-rest";


async function  getResponse(url: string, init?: RequestInit  ): Promise<Response>  {
    let flInnerCatch = false;
     try {
         const response = await fetch(url, init);
         if (response.status < 400 || response.status == 404) {
             return response ;
         }
         const err = response.status == 401 || response.status == 403 ?
         ErrorCode.AUTH_ERROR : ErrorCode.SERVER_UNAVAILABLE;
         flInnerCatch = true
         throw err;
     } catch (err) {
         if (flInnerCatch) {
             throw err;
         } else {
             throw ErrorCode.SERVER_UNAVAILABLE;
         }
     }
}
async function requestRest(url: string, init?: RequestInit): Promise<any> {
    const response: Response = await getResponse(url, init) ;
    return await response.json();
}
class CoursesCache {
    private cacheString: string = '';

    setCache(courses: Course[]): void {
        this.cacheString = JSON.stringify(courses);
    }

    isEquals(other: Course[]): boolean {
        return JSON.stringify(other) === this.cacheString;
    }
    isEmpty(): boolean {
        return this.cacheString.length === 0;
    }
}

function getHeaders(): { Authorization?: string, "Content-Type": string } {
    return { "Content-Type": "application/json",
     Authorization: localStorage.getItem(AUTH_TOKEN) as string};
}
export default class CoursesServiceRestJava implements CoursesService {
    cache: CoursesCache = new CoursesCache();
    stompClient: CompatClient | undefined;
    constructor(private url: string, private wsUrl: string) { }
     add(course: Course): Promise<Course> {
        (course as any).userId = 1;
        return requestRest(this.url, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(course)
        })
       
    }
    async remove(id: number): Promise<Course> {
        const oldCourse = await this.get(id);
        await requestRest(this.getUrlId(id),{
            method: "DELETE",
            headers: getHeaders()
        });
        return oldCourse as Course;
    }
    private getUrlId(id: number) {
        return `${this.url}/${id}`;
    }
    async exists(id: number): Promise<boolean> {
        const response = await getResponse(this.getUrlId(id),{
            headers: getHeaders(),
        } );
        return response.ok;
    }
    get(id?: number): Observable<Course[]> | Promise<Course> {
        if (id) {
            return fetchGet(this.getUrlId(id));
        } else {
            this.cache = new CoursesCache();
            return new Observable<Course[]>(observer => {
                 this.fetchData(observer);
                 this.connect(observer);
                return () => {this.disconnect()};
            });
        }

    }
    async update(id: number, newCourse: Course): Promise<Course> {
        const oldCourse = await this.get(id);
        await fetch(this.getUrlId(id), {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(newCourse)
        });
        return oldCourse as Course;
    }
    private fetchData(observer: Observer<Course[]>) {
        fetchGet(this.url).then(data => observer.next(data)).
        catch(err => observer.error(err))
    }
    private connect(observer: Observer<Course[]>) {
        const webSocket = new SockJS(`${this.wsUrl}/websocket-courses`);
        this.stompClient = Stomp.over(webSocket);
        this.stompClient.connect({}, (frame: any) => {
            this.stompClient!.subscribe("/topic/courses", message => {
                console.log(message.body);
                this.fetchData(observer)
            })
        }, (error:any) => observer.error(error), () => observer.error("disconnected"))
    }
    private disconnect() {
        this.stompClient?.disconnect()
    }
}
 function fetchGet(url: string): Promise<any> {
        return  requestRest(url, {
            headers: {Authorization: localStorage.getItem(AUTH_TOKEN) as string}
        }); 
    
}
