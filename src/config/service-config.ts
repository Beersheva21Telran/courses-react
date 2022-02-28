
import courseData from "./courseData.json";
import College from "../services/college";
import CoursesServiceFirestore from "../services/courses-service-firestore";
import AuthServiceFire from "../services/auth-service-fire";
import AuthServiceFake from "../services/auth-service-fake";
import { FACEBOOK, GOOGLE, TWITTER } from "./networks-config";
import NetworkIcon from "../models/common/network-icon";
import CoursesServiceRest from "../services/courses-service-rest";
import AuthServiceJwt from "../services/auth-service-jwt";
import CoursesServiceRestJava from "../services/courses-service-rest-java";
// export const serviceSupportedNetworks: NetworkIcon[] = [
//     {name: FACEBOOK, iconUrl: "/facebook.png"},
//     {name: GOOGLE, iconUrl: "/google.png"},
//     {name: TWITTER, iconUrl: "/twitter.png"},
    

// ];
export const serviceSupportedNetworks: NetworkIcon[] = [
    
    

];



//const courseProvider = new CoursesServiceFirestore("courses", courseData.minId , courseData.maxId);
//const courseProvider = new CoursesServiceRest("http://localhost:3500/courses");
const courseProvider = new CoursesServiceRestJava("http://localhost:8080/courses");
export const college = new College(courseProvider);
//export const authService = new AuthServiceFire("administrators");
//export const authService = new AuthServiceJwt("http://localhost:3500");
export const authService = new AuthServiceFake();