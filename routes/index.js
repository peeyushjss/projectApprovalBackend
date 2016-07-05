var express = require('express');
var router = express.Router();
var path = require('path');
var multer = require('multer');
var sizeOf = require('image-size');
var fs = require('fs');
var util = require('util');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

var upload = multer({storage: storage});

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});


//-START--API for login, INFORMATION RETRIEVED FROM All_Members TABLE-----------
router.post('/login', function (req, res) {
    var database = req.mysql;
    var member_id = req.body.memberId;
    var password = req.body.password;
    var findDetails = 'SELECT * FROM all_members WHERE member_id=? && password=?';
    database.query(findDetails, [member_id, password], function (err, rows) {
        if (err) {
            res.json({status: 0, msg: err});
        }
        else {
            if (rows.length > 0) {
                var role = rows[0].role;
                res.json({status: 1, msg: 'You are login successfully', role: role});
            }
            else {
                res.json({status: 0, msg: 'You entered the wrong details'});
            }
        }
    });
});
//-END--API for login, INFORMATION RETRIEVED FROM All_Members TABLE-----------

//-START--API for Add New User, INFORMATION SAVED IN All_Members TABLE-----------
router.post('/saveUser', function (req, res) {
    var database = req.mysql;
    var first_name = req.body.firstName;
    var last_name = req.body.lastName;
    var role = req.body.role;
    var department = req.body.department;
    var password = req.body.password;
    var currentyear = parseInt(new Date().getFullYear().toString().substr(2, 2));
    var findRow = 'SELECT * FROM all_numbers';
    database.query(findRow, function (err, rows) {
        if (err) {
            res.json({status: 0, msg: err});
        }
        else {
            if (rows.length === 0) {
                var insertion = 'INSERT INTO all_numbers SET ?';
                var insert_details = {student_number: 0, teacher_number: 0, hod_number: 0};
                database.query(insertion, insert_details, function (error, result) {
                    if (error) {
                        res.json({status: 0, msg: err});
                    }
                    else {
                        if (role === 'student') {
                            var number = 1;
                            var memberId = 'S' + number + '_' + department + currentyear;
                            var insertion = 'INSERT INTO all_members SET ?';
                            var insert_details = {member_id: memberId, password: password, firstName: first_name, lastName: last_name, role: role, department: department};
                            database.query(insertion, insert_details, function (error, result) {
                                if (error) {
                                    res.json({status: 0, msg: err});
                                }
                                else {
                                    var updation = 'UPDATE all_numbers SET ?';
                                    var update_details = {student_number: number};
                                    database.query(updation, update_details, function (err1, result1) {
                                        if (err1) {
                                            res.json({status: 0, msg: err1});
                                        }
                                        else {
                                            var insert_profile_table = 'INSERT INTO all_profiles SET ?';
                                            var insert_profiles = {member_id: memberId};
                                            database.query(insert_profile_table, insert_profiles, function (err2, result2) {
                                                if (err2) {
                                                    res.json({status: 0, msg: err2});
                                                }
                                                else {
                                                    res.json({status: 1, msg: 'User is created successfully', id: memberId});
                                                }
                                            });
                                        }
                                    });

                                }
                            });
                        }
                        else if (role === 'projectIncharge' || role === 'internalGuide') {
                            var number = 1;
                            var memberId = 'T' + number + '_' + department + currentyear;
                            var insertion = 'INSERT INTO all_members SET ?';
                            var insert_details = {member_id: memberId, password: password, firstName: first_name, lastName: last_name, role: role, department: department};
                            database.query(insertion, insert_details, function (error, result) {
                                if (error) {
                                    res.json({status: 0, msg: err});
                                }
                                else {
                                    var updation = 'UPDATE all_numbers SET ?';
                                    var update_details = {teacher_number: number};
                                    database.query(updation, update_details, function (err1, result1) {
                                        if (err1) {
                                            res.json({status: 0, msg: err1});
                                        }
                                        else {
                                            var insert_profile_table = 'INSERT INTO all_profiles SET ?';
                                            var insert_profiles = {member_id: memberId};
                                            database.query(insert_profile_table, insert_profiles, function (err2, result2) {
                                                if (err2) {
                                                    res.json({status: 0, msg: err2});
                                                }
                                                else {
                                                    res.json({status: 1, msg: 'User is created successfully', id: memberId});
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                        else if (role === 'hod') {
                            var number = 1;
                            var memberId = 'H' + number + '_' + department + currentyear;
                            var insertion = 'INSERT INTO all_members SET ?';
                            var insert_details = {member_id: memberId, password: password, firstName: first_name, lastName: last_name, role: role, department: department};
                            database.query(insertion, insert_details, function (error, result) {
                                if (error) {
                                    res.json({status: 0, msg: err});
                                }
                                else {
                                    var updation = 'UPDATE all_numbers SET ?';
                                    var update_details = {hod_number: number};
                                    database.query(updation, update_details, function (err1, result1) {
                                        if (err1) {
                                            res.json({status: 0, msg: err1});
                                        }
                                        else {
                                            var insert_profile_table = 'INSERT INTO all_profiles SET ?';
                                            var insert_profiles = {member_id: memberId};
                                            database.query(insert_profile_table, insert_profiles, function (err2, result2) {
                                                if (err2) {
                                                    res.json({status: 0, msg: err2});
                                                }
                                                else {
                                                    res.json({status: 1, msg: 'User is created successfully', id: memberId});
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    }
                });
            }
            else {
                if (role === 'student') {
                    var digit = parseInt(rows[0].student_number);
                    if (digit === 0) {
                        var n = 0;
                    }
                    else {
                        n = parseInt(rows[0].student_number);
                    }
                    var number = n + 1;
                    var memberId = 'S' + number + '_' + department + currentyear;
                    var insertion = 'INSERT INTO all_members SET ?';
                    var insert_details = {member_id: memberId, password: password, firstName: first_name, lastName: last_name, role: role, department: department};
                    database.query(insertion, insert_details, function (error, result) {
                        if (error) {
                            res.json({status: 0, msg: err});
                        }
                        else {
                            var updation = 'UPDATE all_numbers SET ?';
                            var update_details = {student_number: number};
                            database.query(updation, update_details, function (err1, result1) {
                                if (err1) {
                                    res.json({status: 0, msg: err1});
                                }
                                else {
                                    var insert_profile_table = 'INSERT INTO all_profiles SET ?';
                                    var insert_profiles = {member_id: memberId};
                                    database.query(insert_profile_table, insert_profiles, function (err2, result2) {
                                        if (err2) {
                                            res.json({status: 0, msg: err2});
                                        }
                                        else {
                                            res.json({status: 1, msg: 'User is created successfully', id: memberId});
                                        }
                                    });
                                }
                            });

                        }
                    });
                }
                else if (role === 'projectIncharge' || role === 'internalGuide') {
                    var digit = parseInt(rows[0].teacher_number);
                    if (digit === 0) {
                        var n = 0;
                    }
                    else {
                        n = parseInt(rows[0].teacher_number);
                    }
                    var number = n + 1;
                    var memberId = 'T' + number + '_' + department + currentyear;
                    var insertion = 'INSERT INTO all_members SET ?';
                    var insert_details = {member_id: memberId, password: password, firstName: first_name, lastName: last_name, role: role, department: department};
                    database.query(insertion, insert_details, function (error, result) {
                        if (error) {
                            res.json({status: 0, msg: err});
                        }
                        else {
                            var updation = 'UPDATE all_numbers SET ?';
                            var update_details = {teacher_number: number};
                            database.query(updation, update_details, function (err1, result1) {
                                if (err1) {
                                    res.json({status: 0, msg: err1});
                                }
                                else {
                                    var insert_profile_table = 'INSERT INTO all_profiles SET ?';
                                    var insert_profiles = {member_id: memberId};
                                    database.query(insert_profile_table, insert_profiles, function (err2, result2) {
                                        if (err2) {
                                            res.json({status: 0, msg: err2});
                                        }
                                        else {
                                            res.json({status: 1, msg: 'User is created successfully', id: memberId});
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
                else if (role === 'hod') {
                    var digit = parseInt(rows[0].hod_number);
                    if (digit === 0) {
                        var n = 0;
                    }
                    else {
                        n = parseInt(rows[0].hod_number);
                    }
                    var number = n + 1;
                    var memberId = 'H' + number + '_' + department + currentyear;
                    var insertion = 'INSERT INTO all_members SET ?';
                    var insert_details = {member_id: memberId, password: password, firstName: first_name, lastName: last_name, role: role, department: department};
                    database.query(insertion, insert_details, function (error, result) {
                        if (error) {
                            res.json({status: 0, msg: err});
                        }
                        else {
                            var updation = 'UPDATE all_numbers SET ?';
                            var update_details = {hod_number: number};
                            database.query(updation, update_details, function (err1, result1) {
                                if (err1) {
                                    res.json({status: 0, msg: err1});
                                }
                                else {
                                    var insert_profile_table = 'INSERT INTO all_profiles SET ?';
                                    var insert_profiles = {member_id: memberId};
                                    database.query(insert_profile_table, insert_profiles, function (err2, result2) {
                                        if (err2) {
                                            res.json({status: 0, msg: err2});
                                        }
                                        else {
                                            res.json({status: 1, msg: 'User is created successfully', id: memberId});
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            }
        }
    });
});
//-END--API for Add New User, INFORMATION SAVED IN All_Members TABLE-------------

//-START--API for Update, INFORMATION SAVED IN All_PROFILES TABLE-----------
router.post('/updateProfile', function (req, res) {
    var database = req.mysql;
    var self = req.body;
    var mymemberId = self.memberId;
    var myfirstname = self.firstName;
    var mylastname = self.lastName;
    var mydepartment = self.department;
    var mydob = self.dob;
    var myaddress = self.address;
    var mycontact = self.contact;
    var myfatherName = self.fatherName;
    var mymotherName = self.motherName;
    var myqualification = self.qualification;
    var myspecialization = self.specialization;
    var updation = 'UPDATE all_profiles SET ? WHERE ?';
    var update_details = {firstName: myfirstname, lastName: mylastname, fatherName: myfatherName,
        motherName: mymotherName, dob: mydob, department: mydepartment, address: myaddress, contact: mycontact,
        qualification: myqualification, specialization: myspecialization};
    var idDetails = {member_id: mymemberId};
    database.query(updation, [update_details, idDetails], function (err) {
        if (err) {
            res.json({status: 0, msg: err});
        }
        else {
            res.json({status: 1, msg: 'Profile Updated'});
        }
    });
});
//-END--API for Update, INFORMATION SAVED IN All_PROFILES TABLE-----------

//-START--API for Fetch Profile, INFORMATION SAVED IN All_PROFILES TABLE-----------
router.post('/getProfile', function (req, res) {
    var database = req.mysql;
    var member_id = req.body.member_id;
    var findDetails = 'SELECT * FROM all_profiles WHERE member_id=?';
    database.query(findDetails, [member_id], function (err, rows) {
        if (err) {
            res.json({status: 0, msg: err});
        }
        else {
            if (rows.length > 0) {
                var result = rows[0];
                res.json({status: 1, details: result});
            }
            else {
                res.json({status: 0, msg: 'Record not found'});
            }
        }
    });
});
//-END--API for Fetch Profile, INFORMATION SAVED IN All_PROFILES TABLE-----------

//-START--API for Fetch UserList, INFORMATION SAVED IN All_PROFILES TABLE-----------
router.get('/getUserList', function (req, res) {
    var database = req.mysql;
    var getDetails = 'SELECT * FROM all_members WHERE role != "admin"';
    database.query(getDetails, function (err, rows) {
        if (err) {
            res.json({status: 0, msg: err});
        }
        else {
            if (rows.length > 0) {
                var result = rows;
                res.json({status: 1, details: result});
            }
            else {
                res.json({status: 0, msg: 'Record not found'});
            }
        }
    });
});
//-END--API for Fetch UserList., INFORMATION SAVED IN All_PROFILES TABLE-----------

//-START--API for Fetch Perticular User, INFORMATION FETCH FROM All_MEMBERS TABLE-----------
router.post('/getUser', function (req, res) {
    var database = req.mysql;
    var memberId = req.body.id;
    var getDetails = 'SELECT * FROM all_members WHERE member_id =?';
    database.query(getDetails, [memberId], function (err, rows) {
        if (err) {
            res.json({status: 0, msg: err});
        }
        else {
            if (rows.length > 0) {
                var result = rows;
                res.json({status: 1, details: result});
            }
            else {
                res.json({status: 0, msg: 'Record not found'});
            }
        }
    });
});
//-END--API for Fetch UserList., INFORMATION SAVED IN All_PROFILES TABLE-----------

//-START--API for Delete User, INFORMATION DELETED FROM ALL_PROFILES and ALL_MEMBERS TABLE-----------
router.post('/deleteUser', function (req, res) {
    var database = req.mysql;
    var memberId = req.body.memberId;
    var deleteProfile = 'DELETE FROM all_profiles WHERE member_id=?';
    database.query(deleteProfile, [memberId], function (err, rows) {
        if (err) {
            res.json({status: 0, msg: err});
        }
        else {
            var deleteUser = 'DELETE FROM all_members WHERE member_id=?';
            database.query(deleteUser, [memberId], function (error, result) {
                if (error) {
                    res.json({status: 0, msg: error});
                }
                else {
//                    if (result.length > 0) {
                    res.json({status: 1});
//                    }
//                    else {
//                        res.json({status: 0, msg: ' No Record to Delete'});
//                    }
                }
            });
        }
    });
});
//-END--API for Delete User, INFORMATION DELETED FROM ALL_PROFILES and ALL_MEMBERS TABLE-----------

//-START--API for Update User, INFORMATION UPDATED FROM ALL_MEMBERS TABLE-----------
router.post('/updateUser', function (req, res) {
    var database = req.mysql;
    var memberId = req.body.memberId;
    var firstName = req.body.firstname;
    var lastName = req.body.lastname;
    var role = req.body.role;
    var department = req.body.department;
    var password = req.body.password;
    var updateUser = 'UPDATE all_members SET ? WHERE ?';
    var updateDetails = {firstName: firstName, lastName: lastName, role: role, department: department, password: password};
    var idDetails = {member_id: memberId};
    database.query(updateUser, [updateDetails, idDetails], function (err, rows) {
        if (err) {
            res.json({status: 0, msg: err});
        }
        else {
            res.json({status: 1, msg: 'User Details Updated.'});
        }
    });
});
//-END--API for Delete User, INFORMATION DELETED FROM ALL_PROFILES and ALL_MEMBERS TABLE------------------

//-START--API for Fetch ProjectList, INFORMATION SAVED IN All_PROJECTS TABLE------------------------------
router.get('/getProjectList', function (req, res) {
    var database = req.mysql;
    var getProjects = 'SELECT * FROM all_projects';
    database.query(getProjects, function (err, rows) {
        if (err) {
            res.json({status: 0, msg: err});
        }
        else {
            if (rows.length > 0) {
                var result = rows;
                res.json({status: 1, details: result});
            }
            else {
                res.json({status: 0, msg: 'Record not found'});
            }
        }
    });
});
//-END--API for Fetch ProjectList, INFORMATION SAVED IN All_PROJECTS TABLE--------------------------------

//-START--API for Save Project, INFORMATION SAVED IN All_PROJECTS TABLE-----------------------------------
router.all('/saveProject', upload.single('file'), function (req, res, next) {
    var database = req.mysql;
    var projectName = req.body.name;
    var userId = req.body.id;
    var intro = req.body.intro;
    var findRow = 'SELECT * FROM all_projects WHERE member_id=?';
    database.query(findRow, [userId], function (err, rows) {
        if (err) {
            res.json({status: 0, msg: err});
        }
        else {
            if (rows.length === 0) {
                var insertProject = 'INSERT INTO all_projects SET ?';
                var insertDetails = {project_id: userId, project_name: projectName, member_id: userId,
                    hod_approval: 'pending', incharge_approval: 'pending', internal_guide_approval: 'pending',
                    guide_name: '', project_description: intro, assign_date: '', submit_date: ''};
                database.query(insertProject, [insertDetails], function (err, rows) {
                    if (err) {
                        res.json({status: 0, msg: err});
                    }
                    else {
                        if (req.body.type === 'project') {
                            existFile = 'uploads/' + req.file.filename;
                            var directory = 'uploads/projects/' + req.body.id;
                            var writeFile = 'uploads/projects/' + req.body.id + '/' + req.file.filename;
                            if (!fs.existsSync(directory)) {
                                fs.mkdirSync(directory);
                                fs.exists(directory, function (exists) {
                                    if (exists) {
                                        var oldFile = fs.createReadStream(existFile);
                                        var newFile = fs.createWriteStream(writeFile);
                                        util.pump(oldFile, newFile, function () {
                                            fs.unlinkSync(existFile);
                                            fs.rename(writeFile, directory + '/' + req.body.id + path.extname(req.file.originalname), function (err) {
                                                if (err) {
                                                    res.json({status: 0, msg: err});
                                                }
                                                else {
                                                    res.json({status: 1});
                                                }
                                            });
                                        });
                                    }
                                    else {
                                        res.json({status: 0, msg: 'File is not uploaded'});
                                    }
                                });
                            }
                            else {
                                fs.exists(directory, function (exists) {
                                    if (exists) {
                                        var oldFile = fs.createReadStream(existFile);
                                        var newFile = fs.createWriteStream(writeFile);
                                        util.pump(oldFile, newFile, function () {
                                            fs.unlinkSync(existFile);
                                            fs.rename(writeFile, directory + '/' + req.body.id + path.extname(req.file.originalname), function (err) {
                                                if (err) {
                                                    res.json({status: 0, msg: err});
                                                }
                                                else {
                                                    res.json({status: 1});
                                                }
                                            });
                                        });
                                    }
                                    else {
                                        res.json({status: 0, msg: 'File is not uploaded'});
                                    }
                                });
                            }
                        }
                        else if (req.body.type === 'synopsys') {
                            existFile = 'uploads/' + req.file.filename;
                            var directory = 'uploads/synopsys/' + req.body.id;
                            var writeFile = 'uploads/synopsys/' + req.body.id + '/' + req.file.filename;
                            if (!fs.existsSync(directory)) {
                                fs.mkdirSync(directory);
                                fs.exists(directory, function (exists) {
                                    if (exists) {
                                        var oldFile = fs.createReadStream(existFile);
                                        var newFile = fs.createWriteStream(writeFile);
                                        util.pump(oldFile, newFile, function () {
                                            fs.unlinkSync(existFile);
                                            fs.rename(writeFile, directory + '/' + req.body.id + path.extname(req.file.originalname), function (err) {
                                                if (err) {
                                                    res.json({status: 0, msg: err});
                                                }
                                                else {
                                                    res.json({status: 1});
                                                }
                                            });
                                        });
                                    }
                                    else {
                                        res.json({status: 0, msg: 'File is not uploaded'});
                                    }
                                });
                            }
                            else {
                                fs.exists(directory, function (exists) {
                                    if (exists) {
                                        var oldFile = fs.createReadStream(existFile);
                                        var newFile = fs.createWriteStream(writeFile);
                                        util.pump(oldFile, newFile, function () {
                                            fs.unlinkSync(existFile);
                                            fs.rename(writeFile, directory + '/' + req.body.id + path.extname(req.file.originalname), function (err) {
                                                if (err) {
                                                    res.json({status: 0, msg: err});
                                                }
                                                else {
                                                    res.json({status: 1});
                                                }
                                            });
                                        });
                                    }
                                    else {
                                        res.json({status: 0, msg: 'File is not uploaded'});
                                    }
                                });
                            }
                        }
                    }
                });
            }
            else {
                if (rows[0].hod_approval === 'pending') {
                    var updateProject = 'UPDATE all_projects SET ? WHERE ?';
                    var updateDetails = {project_name: projectName, member_id: userId, project_description: intro};
                    var idDetails = {member_id: userId};
                    database.query(updateProject, [updateDetails, idDetails], function (err, rows) {
                        if (err) {
                            res.json({status: 0, msg: err});
                        }
                        else {
                            if (req.body.type === 'project') {
                                existFile = 'uploads/' + req.file.filename;
                                var directory = 'uploads/projects/' + req.body.id;
                                var writeFile = 'uploads/projects/' + req.body.id + '/' + req.file.filename;
                                if (!fs.existsSync(directory)) {
                                    fs.mkdirSync(directory);
                                    fs.exists(directory, function (exists) {
                                        if (exists) {
                                            var oldFile = fs.createReadStream(existFile);
                                            var newFile = fs.createWriteStream(writeFile);
                                            util.pump(oldFile, newFile, function () {
                                                fs.unlinkSync(existFile);
                                                fs.rename(writeFile, directory + '/' + req.body.id + path.extname(req.file.originalname), function (err) {
                                                    if (err) {
                                                        res.json({status: 0, msg: err});
                                                    }
                                                    else {
                                                        res.json({status: 1});
                                                    }
                                                });
                                            });
                                        }
                                        else {
                                            res.json({status: 0, msg: 'File is not uploaded'});
                                        }
                                    });
                                }
                                else {
                                    fs.exists(directory, function (exists) {
                                        if (exists) {
                                            var oldFile = fs.createReadStream(existFile);
                                            var newFile = fs.createWriteStream(writeFile);
                                            util.pump(oldFile, newFile, function () {
                                                fs.unlinkSync(existFile);
                                                fs.rename(writeFile, directory + '/' + req.body.id + path.extname(req.file.originalname), function (err) {
                                                    if (err) {
                                                        res.json({status: 0, msg: err});
                                                    }
                                                    else {
                                                        res.json({status: 1});
                                                    }
                                                });
                                            });
                                        }
                                        else {
                                            res.json({status: 0, msg: 'File is not uploaded'});
                                        }
                                    });
                                }
                            }
                            else if (req.body.type === 'synopsys') {
                                existFile = 'uploads/' + req.file.filename;
                                var directory = 'uploads/synopsys/' + req.body.id;
                                var writeFile = 'uploads/synopsys/' + req.body.id + '/' + req.file.filename;
                                if (!fs.existsSync(directory)) {
                                    fs.mkdirSync(directory);
                                    fs.exists(directory, function (exists) {
                                        if (exists) {
                                            var oldFile = fs.createReadStream(existFile);
                                            var newFile = fs.createWriteStream(writeFile);
                                            util.pump(oldFile, newFile, function () {
                                                fs.unlinkSync(existFile);
                                                fs.rename(writeFile, directory + '/' + req.body.id + path.extname(req.file.originalname), function (err) {
                                                    if (err) {
                                                        res.json({status: 0, msg: err});
                                                    }
                                                    else {
                                                        res.json({status: 1});
                                                    }
                                                });
                                            });
                                        }
                                        else {
                                            res.json({status: 0, msg: 'File is not uploaded'});
                                        }
                                    });
                                }
                                else {
                                    fs.exists(directory, function (exists) {
                                        if (exists) {
                                            var oldFile = fs.createReadStream(existFile);
                                            var newFile = fs.createWriteStream(writeFile);
                                            util.pump(oldFile, newFile, function () {
                                                fs.unlinkSync(existFile);
                                                fs.rename(writeFile, directory + '/' + req.body.id + path.extname(req.file.originalname), function (err) {
                                                    if (err) {
                                                        res.json({status: 0, msg: err});
                                                    }
                                                    else {
                                                        res.json({status: 1});
                                                    }
                                                });
                                            });
                                        }
                                        else {
                                            res.json({status: 0, msg: 'File is not uploaded'});
                                        }
                                    });
                                }
                            }
                        }
                    });
                }
                else {
                    var updateProject = 'UPDATE all_projects SET ? WHERE ?';
                    var updateDetails = {member_id: userId, project_description: intro};
                    var idDetails = {member_id: userId};
                    database.query(updateProject, [updateDetails, idDetails], function (err, rows) {
                        if (err) {
                            res.json({status: 0, msg: err});
                        }
                        else {
                            if (req.body.type === 'project') {
                                existFile = 'uploads/' + req.file.filename;
                                var directory = 'uploads/projects/' + req.body.id;
                                var writeFile = 'uploads/projects/' + req.body.id + '/' + req.file.filename;
                                if (!fs.existsSync(directory)) {
                                    fs.mkdirSync(directory);
                                    fs.exists(directory, function (exists) {
                                        if (exists) {
                                            var oldFile = fs.createReadStream(existFile);
                                            var newFile = fs.createWriteStream(writeFile);
                                            util.pump(oldFile, newFile, function () {
                                                fs.unlinkSync(existFile);
                                                fs.rename(writeFile, directory + '/' + req.body.id + path.extname(req.file.originalname), function (err) {
                                                    if (err) {
                                                        res.json({status: 0, msg: err});
                                                    }
                                                    else {
                                                        res.json({status: 1});
                                                    }
                                                });
                                            });
                                        }
                                        else {
                                            res.json({status: 0, msg: 'File is not uploaded'});
                                        }
                                    });
                                }
                                else {
                                    fs.exists(directory, function (exists) {
                                        if (exists) {
                                            var oldFile = fs.createReadStream(existFile);
                                            var newFile = fs.createWriteStream(writeFile);
                                            util.pump(oldFile, newFile, function () {
                                                fs.unlinkSync(existFile);
                                                fs.rename(writeFile, directory + '/' + req.body.id + path.extname(req.file.originalname), function (err) {
                                                    if (err) {
                                                        res.json({status: 0, msg: err});
                                                    }
                                                    else {
                                                        res.json({status: 1});
                                                    }
                                                });
                                            });
                                        }
                                        else {
                                            res.json({status: 0, msg: 'File is not uploaded'});
                                        }
                                    });
                                }
                            }
                            else if (req.body.type === 'synopsys') {
                                existFile = 'uploads/' + req.file.filename;
                                var directory = 'uploads/synopsys/' + req.body.id;
                                var writeFile = 'uploads/synopsys/' + req.body.id + '/' + req.file.filename;
                                if (!fs.existsSync(directory)) {
                                    fs.mkdirSync(directory);
                                    fs.exists(directory, function (exists) {
                                        if (exists) {
                                            var oldFile = fs.createReadStream(existFile);
                                            var newFile = fs.createWriteStream(writeFile);
                                            util.pump(oldFile, newFile, function () {
                                                fs.unlinkSync(existFile);
                                                fs.rename(writeFile, directory + '/' + req.body.id + path.extname(req.file.originalname), function (err) {
                                                    if (err) {
                                                        res.json({status: 0, msg: err});
                                                    }
                                                    else {
                                                        res.json({status: 1});
                                                    }
                                                });
                                            });
                                        }
                                        else {
                                            res.json({status: 0, msg: 'File is not uploaded'});
                                        }
                                    });
                                }
                                else {
                                    fs.exists(directory, function (exists) {
                                        if (exists) {
                                            var oldFile = fs.createReadStream(existFile);
                                            var newFile = fs.createWriteStream(writeFile);
                                            util.pump(oldFile, newFile, function () {
                                                fs.unlinkSync(existFile);
                                                fs.rename(writeFile, directory + '/' + req.body.id + path.extname(req.file.originalname), function (err) {
                                                    if (err) {
                                                        res.json({status: 0, msg: err});
                                                    }
                                                    else {
                                                        res.json({status: 1});
                                                    }
                                                });
                                            });
                                        }
                                        else {
                                            res.json({status: 0, msg: 'File is not uploaded'});
                                        }
                                    });
                                }
                            }
                        }
                    });
                }
            }
        }
    });
});
//-END--API for Save Project, INFORMATION SAVED IN All_PROJECTS TABLE-------------------------------------

//-START--API for Fetch Project Of a Perticular Person, INFORMATION SAVED IN All_PROJECTS TABLE-----------
router.get('/getProjectList/:userId', function (req, res) {
    var database = req.mysql;
    var id = req.params.userId;
    var getProjects = 'SELECT * FROM all_projects WHERE member_id=?';
    database.query(getProjects, [id], function (err, rows) {
        if (err) {
            res.json({status: 0, msg: err});
        }
        else {
            if (rows.length > 0) {
                var result = rows;
                res.json({status: 1, details: result});
            }
            else {
                res.json({status: 0, msg: 'Record not found'});
            }
        }
    });
});
//-END--API for Fetch Project Of a Perticular Person, INFORMATION SAVED IN All_PROJECTS TABLE-----------

module.exports = router;
