import React, { Component } from 'react';
import axios from 'axios';

class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      schoolName: 'Your School Name',
      studentName: '',
      studentClass: '',
      students: [],
    };
  }

  componentDidMount() {
    // Fetch the list of students from AWS Lambda API
    axios.get('YOUR_API_ENDPOINT/students')
      .then((response) => {
        this.setState({ students: response.data });
      })
      .catch((error) => {
        console.error('Error fetching students:', error);
      });
  }

  handleAddStudent = () => {
    const { studentName, studentClass } = this.state;
    // Send a POST request to AWS Lambda to add a new student
    axios.post('YOUR_API_ENDPOINT/students', { studentName, studentClass })
      .then((response) => {
        // Refresh the list of students
        this.componentDidMount();
      })
      .catch((error) => {
        console.error('Error adding student:', error);
      });
  };

  handleToggleDefaulter = (studentId) => {
    // Send a PUT request to AWS Lambda to toggle defaulter status
    axios.put(`YOUR_API_ENDPOINT/students/${studentId}/toggle-defaulter`)
      .then((response) => {
        // Refresh the list of students
        this.componentDidMount();
      })
      .catch((error) => {
        console.error('Error toggling defaulter status:', error);
      });
  };

  render() {
    const { schoolName, studentName, studentClass, students } = this.state;

    return (
      <div>
        <h1>{schoolName} Dashboard</h1>
        <div>
          <h2>Add Student</h2>
          <input
            type="text"
            placeholder="Student Name"
            value={studentName}
            onChange={(e) => this.setState({ studentName: e.target.value })}
          />
          <input
            type="text"
            placeholder="Student Class"
            value={studentClass}
            onChange={(e) => this.setState({ studentClass: e.target.value })}
          />
          <button onClick={this.handleAddStudent}>Add</button>
        </div>
        <div>
          <h2>Student List</h2>
          <ul>
            {students.map((student) => (
              <li key={student.id}>
                {student.studentName}, Class {student.studentClass}, Defaulter: {student.defaulter ? 'Yes' : 'No'}
                <button onClick={() => this.handleToggleDefaulter(student.id)}>Toggle Defaulter</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default Dashboard;
