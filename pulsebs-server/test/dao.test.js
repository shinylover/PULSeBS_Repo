const DAO = require("../pulsebsDAO.js");

//REMEMBER TO CLEAR DATABASE BEFORE TESTING IN ORDER TO AVOID POSSIBLE ERRORS DUE TO CONFLICTS

describe("Login test suite", () => {
    test('Try to login with < davide.calarco@gmail.com, password>', () => {
        return DAO.getUserByEmail('davide.calarco@gmail.com', 'password').then(result => {
            expect(result.name).toBe('Davide');
        });
    });

    test('Try to login with < hyeronimus.bosch@gmail.com, password>', () => {
        return DAO.getUserByEmail('hyeronimus.bosch@gmail.com', 'password').then(result => {
            expect(result.name).toBe('Hyeronimus');
        });
    });

    test('Try to login with < harry.houdini@gmail.com, password>', () => {
        return DAO.getUserByEmail('harry.houdini@gmail.com', 'password').then(result => {
            expect(result.name).toBe('Harry');
        });
    });
});

// Test authenticated user
test('Try information about one user authenticated',()=>{
    return DAO.getUserById('239901').then( result =>{
       expect(result.name).toBe("Hyeronimus");
    } );
}   );

test('Try information about one user authenticated 2',()=>{
    return expect(DAO.getUserById('239900')).rejects.toBeUndefined();
}   );

test('Try information about one user authenticated 3',()=>{
    return expect(DAO.getUserById()).rejects.toBeUndefined();
}   );

//BOOKING A SEAT
test( 'Try to book a new seat', () => {
    return DAO.bookSeat( '2', '269901' ).then( result => {
        expect( result ).toBe( 1 );
    } );
} );

//GET STUDENT LECTURES
test( 'Try to get a student\'s lectures', () => {
    return DAO.getStudentLectures( '269901' ).then( result => {
        expect( result.length ).toEqual( 4 );
    } )
} );

//GET TEACHER LECTURES
test( 'Try to get a teacher\'s lectures', () => {
    return DAO.getTeacherLectures( '239901' ).then( result => {
        expect(result.length).toBe(4); //or toEqual
    } );
} );

//GET STUDENTS BOOKED FOR LECTURE ID
test('Try to get students booked for lectures of 1 professor', () => {
    return DAO.getStudentsForLecturev2('239901').then( result => {
        expect(result.length).toBe(2);
    });
});

//Francesco' Test
/*test('Try to get students booked for lecture 1', () => {
    return DAO.getStudentsForLecture(1).then( result => {
        expect(result[0].ref_student).toEqual(269901);
    })

});*/

//GET ALL STUDENT'S BOOKINGS
test('Try to get all student\'s bookings', () => {
    return DAO.getStudentBookings('269901').then( result => {
        expect(result.length).toEqual(3);
    })
});

//GET TOMORROW LESSONS STATS
test('Try to get all students booked for tomorrow lectures', () => {
    return DAO.getTomorrowLessonsStats(true).then(result => {
        expect(result.length).toEqual(1);
    });
});

//EDIT PRESENCE LECTURE
test('Try to put a lecture in remote', () => {
    return DAO.setPresenceLecture(2).then( result => {
        expect(result).toEqual(1);
    });
});

//CANCEL A BOOKING
test('Try to cancel a booking', () => {
    return DAO.cancelBooking(1).then( result => {
        expect(result).toEqual(1);
    })
});

//CANCEL LECTURE
test('Try to cancel a lecture', () => {
    return DAO.cancelLecture(2).then( result => {
        expect(result).toEqual(1);
    })
});
