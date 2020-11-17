import React from 'react';
import { withRouter,Switch,Route} from 'react-router-dom';
import '../App.css';
import API from '../API/API';
import CourseList from './CourseList';
import LectureList from './LectureList';
import StudentList from './StudentiList';
import ButtonTeacherHub from './ButtonTeacherHub';

class TeacherPage extends React.Component{
    constructor(props){
        super(props);
        this.state={id: this.props.id,email:'',name:this.props.name,surname:this.props.surname,userType:'teacher',lectures:[],courses:[],id_courses:[],students:[]};
    }

    componentDidMount(){
        API.getTeacherLectures()
        .then((lectures)=>{
          this.setState({ lectures: lectures, courses: this.getCourses(lectures).sort(), id_courses: this.getIdCourses(lectures).sort(),students:this.getStudentsByLecture(this.state.id)});
        })
        .catch((err) => {
            console.log(err);
        });
    }

    handleErrors(err) {
        if (err) {
          if (err.status && err.status === 401) {
            this.setState({ authErr: err.errorObj });
            this.props.history.push("/");
          }
        }
      }

    getCourses(lectures){
    return [...new Set(lectures.map((course) => {
      if (course.course)
        return course.course;
      else
        return null;
    }))];
  }

  getIdCourses(lectures){
    return [...new Set(lectures.map((course)=>{
      if(course.id)
        return course.id;
        else
        return null;
    }))];
  }

  getStudentsByLecture(lectureId){
    API.getStudents(lectureId)
    .then((student)=>{
      this.setState({students:student});
    })
    .catch((err) => {
            console.log(err);
        });
  }

  render(){
      return(
        <div>
          
          <Switch>
            <Route exact path="/teacher" component={ButtonTeacherHub}/>
          <Route exact path={"/teacher/courses"}>
              <CourseList courses={this.state.courses} idc={this.state.id_courses} />
          </Route>
          <Route exact path={"/teacher/:courseId/lectures"} render={({match})=>(
            <LectureList lectures={this.state.lectures} idc={match.params.courseId} />
          )}/>
          <Route exact path={"/teacher/:courseId/:lectureId/students"} render={({match})=>(
              <StudentList students={this.state.students} idl={match.params.lectureId}/>
          )}/>
          </Switch>
        </div>
          
      );
  }
}

export default withRouter(TeacherPage);