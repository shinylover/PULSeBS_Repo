import Lecture from './Lecture.js'
import Booking from './Booking.js'
import Student from './Student'
import Teacher from './Teacher'
import Course from './Course'
import Enrollment from './Enrollment'
import Schedule from './Schedule'
import LectureTeacher from './LectureTeacher.js'
import { Ellipsis } from 'react-bootstrap/esm/PageItem';
const baseURL = "/api";


async function login(email, password) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + '/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email, password: password }),
        }).then((response) => {
            if (response.ok) {
                response.json().then((user) => {
                    resolve(user);
                });
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

async function logout() {
    return new Promise((resolve, reject) => {
        fetch(baseURL + '/logout', {
            method: 'POST',
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        });
    });
}

/****** STUDENT *******/

async function getStudentLectures() {
    let url = "/student/lectures";
    const response = await fetch(baseURL + url);
    const lecturesJson = await response.json();
    if(response.ok){
        //console.log(lecturesJson);
        return lecturesJson.map((l) => new Lecture(l.id, l.date, l.presence, l.bookable, l.active, l.course, l.name, l.surname, l.class));
    } else {
        let err = { status: response.status, errObj: lecturesJson };
        throw err;  // An object with the error coming from the server
    }
}

// FIXME:
async function bookSeat(studentId, lectureId) {
    return new Promise((resolve, reject) => {
    fetch(baseURL + "/students/" + studentId + "/booking", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({lectureId : lectureId}),
    }).then((response) => {
        if(response.ok) {
            resolve(response);
        } else {
            // analyze the cause of error
            console.log("errore msg");
            response.json()
            .then( (obj) => {reject(obj);} ) // error msg in the response body
            .catch( (err) => {reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
        }
    }).catch( (err) => {reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
 });
}


async function getStudentBookings() {
    let url = "/student/bookings";
    const response = await fetch(baseURL + url);
    const bookingsJson = await response.json();
    if(response.ok){
        //console.log(bookingsJson);
        return bookingsJson.map((b) => new Booking(b.id,b.ref_student, b.ref_lecture, b.date, b.course, b.class, b.presence, b.active));
    } else {
        let err = { status: response.status, errObj: bookingsJson };
        throw err;  // An object with the error coming from the server
    }

}

// FIXME: already successfully refactor the URI
async function cancelBooking(studentId, bookingId) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + '/students/' + studentId + '/bookings/' + bookingId, {
            method: 'DELETE'
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); })
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); //something else
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    })
}


/****** TEACHER *******/
async function getTeacherLectures() {
    let url="/teacher/lectures";
    const response=await fetch(baseURL+url);
    const lecturesJson=await response.json();
    if(response.ok){
        return lecturesJson.map((l) => new LectureTeacher(l.course, l.class, l.id,l.lecId, l.date, l.endTime, l.presence, l.bookable, l.active));
    }else{
        let err = {status: response.status, errObj:lecturesJson};
        throw err;
    }
}

async function getStudents(filter) {
    let url = "/teacher/getStudentsForLecture";
    const response = await fetch(baseURL + url);
    const idJson = await response.json();
    if (response.ok) {
        return idJson;
    } else {
        let err = { status: response.status, errObj: idJson };
        throw err;  // An object with the error coming from the server
    }
}

async function turnLectureIntoOnline(lectureId, teacherId = 0) {
    // teacherId is useless, the lectureId is enough
    let url = '/teachers/' + teacherId + '/lectures/' + lectureId;
    let response;
    try {
        response = await fetch(baseURL + url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ presence: 0 })
        });
    } catch (networkError) {
        throw {message: "Network error occured in " + turnLectureIntoOnline.name + ": " + networkError};
    }
    let message;
    try {
        message = (await response.json()).message;
    } catch (parseError) {
        console.log("Parse error occured in " + turnLectureIntoOnline.name + parseError);
    }
    if (response.status === 200) return message;
    else throw {message: message};
}


async function cancelLecture(teacherId, lectureId) {
    console.log(teacherId);
    console.log(lectureId);
    return new Promise((resolve, reject) => {
        fetch(baseURL + "/teachers/" + teacherId + "/lectures/" + lectureId, {
            method: 'DELETE',
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                .then( (obj) => {reject(obj);})
                .catch( (err) => { reject({errors: [{ param: "Application", msg: "Cannot parse server response" }]})}); //something else
            }
        }).catch( (err) => {reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    })
}


/**** SUPPORT OFFICE ****/

/*async function importCSV(students, teachers, courses, enrollments, schedule) {
    return new Promise((resolve, reject) => {
    fetch(baseURL + "/sofficer/", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ students: students.map((s) => new Student(s.id, s.name, s.surname, s.email, s.city, s.bday, s.ssn)),
                               teachers: teachers.map((t) => new Teacher(t.id, t.name, t.surname, t.email, t.ssn)),
                               courses: courses.map((c) => new Course(c.id, c.year, c.semester, c.course)), 
                               enrollments: enrollments.map((e) => new Enrollment(e.cid, e.sid)),
                               schedule: schedules.map((s) => new Schedule(s.id, s.room, s.date, s.seats, s.time))
        }),
    }).then((response) => {
        if(response.ok) {
            resolve(response);
        } else {
            // analyze the cause of error
            console.log("errore msg");
            response.json()
            .then( (obj) => {reject(obj);} ) // error msg in the response body
            .catch( (err) => {reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
        }
    }).catch( (err) => {reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
 });
}*/



async function isAuthenticated(){
    let url = "/user";
    const response = await fetch(baseURL + url);
    const userJson = await response.json();
    if(response.ok){
        return userJson;
    } else {
        let err = {status: response.status, errObj:userJson};
        throw err;  // An object with the error coming from the server
    }
}




const API = { login, logout, getStudentLectures, bookSeat, getStudentBookings, cancelBooking, getTeacherLectures, getStudents,isAuthenticated, turnLectureIntoOnline, cancelLecture /*,importCSV*/ };
export default API;
