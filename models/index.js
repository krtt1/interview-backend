const Employee = require('./employee');
const JobTitle = require('./jobTitle');
const PositionLevel = require('./positionLevel');
const PositionType = require('./positionType');
const JobGroup = require('./jobGroup');
const Meeting = require('./meeting');
const MeetingEmployee = require('./meetingEmployee');
const Command = require('./command');
const CommandEmployee = require('./commandEmployee');
const EmployeeJobHistory = require('./employeeJobHistory');
const Capacity = require('./capacity');
const CapacityTrainingCourses = require('./capacityTrainingCourses');
const CapacityVectorCourses = require('./capacityVectorCourses');
const CapacityEnvoccCourses = require('./capacityEnvoccCourses');
const CapacityLawCourses = require('./capacityLawCourses');
const CapacityOtherExperiences = require('./capacityOtherExperiences');

// Employee relations
Employee.belongsTo(JobTitle, { foreignKey: 'job_title_id', as: 'jobTitle' });
Employee.belongsTo(PositionLevel, { foreignKey: 'position_level_id', as: 'positionLevel' });
Employee.belongsTo(PositionType, { foreignKey: 'position_type_id', as: 'positionType' });
Employee.belongsTo(JobGroup, { foreignKey: 'job_group_id', as: 'jobGroup' });

// Employee Job History relations
Employee.hasMany(EmployeeJobHistory, { foreignKey: 'employee_id', as: 'jobHistory' });
EmployeeJobHistory.belongsTo(Employee, { foreignKey: 'employee_id', as: 'employee' });
EmployeeJobHistory.belongsTo(JobGroup, { foreignKey: 'job_group_id', as: 'jobGroup' });
EmployeeJobHistory.belongsTo(PositionType, { foreignKey: 'position_type_id', as: 'positionType' });
EmployeeJobHistory.belongsTo(PositionLevel, { foreignKey: 'position_level_id', as: 'positionLevel' });

// Meeting ↔ MeetingEmployee ↔ Employee
Meeting.hasMany(MeetingEmployee, { foreignKey: 'meeting_id', as: 'meetingEmployees' });
MeetingEmployee.belongsTo(Meeting, { foreignKey: 'meeting_id', as: 'meeting' });
MeetingEmployee.belongsTo(Employee, { foreignKey: 'employee_id', as: 'employee' });

// Command ↔ CommandEmployee ↔ Employee
Command.hasMany(CommandEmployee, { foreignKey: 'command_id', as: 'commandEmployees' });
CommandEmployee.belongsTo(Command, { foreignKey: 'command_id', as: 'command' });
CommandEmployee.belongsTo(Employee, { foreignKey: 'employee_id', as: 'employee' });

// Capacity relations
Employee.hasOne(Capacity, { foreignKey: 'employee_id', as: 'capacity' });
Capacity.belongsTo(Employee, { foreignKey: 'employee_id', as: 'employee' });

// Capacity ↔ Training Courses (1:N)
Capacity.hasMany(CapacityTrainingCourses, { foreignKey: 'employee_id', sourceKey: 'employee_id', as: 'trainingCourses' });
CapacityTrainingCourses.belongsTo(Capacity, { foreignKey: 'employee_id', targetKey: 'employee_id', as: 'capacity' });

// Capacity ↔ Vector Courses (1:N)
Capacity.hasMany(CapacityVectorCourses, { foreignKey: 'employee_id', sourceKey: 'employee_id', as: 'vectorCourses' });
CapacityVectorCourses.belongsTo(Capacity, { foreignKey: 'employee_id', targetKey: 'employee_id', as: 'capacity' });

// Capacity ↔ EnvOcc Courses (1:N)
Capacity.hasMany(CapacityEnvoccCourses, { foreignKey: 'employee_id', sourceKey: 'employee_id', as: 'envoccCourses' });
CapacityEnvoccCourses.belongsTo(Capacity, { foreignKey: 'employee_id', targetKey: 'employee_id', as: 'capacity' });

// Capacity ↔ Law Courses (1:N)
Capacity.hasMany(CapacityLawCourses, { foreignKey: 'employee_id', sourceKey: 'employee_id', as: 'lawCourses' });
CapacityLawCourses.belongsTo(Capacity, { foreignKey: 'employee_id', targetKey: 'employee_id', as: 'capacity' });

// Capacity ↔ Other Experiences (1:N)
Capacity.hasMany(CapacityOtherExperiences, { foreignKey: 'employee_id', sourceKey: 'employee_id', as: 'otherExperiences' });
CapacityOtherExperiences.belongsTo(Capacity, { foreignKey: 'employee_id', targetKey: 'employee_id', as: 'capacity' });

module.exports = {
  Employee,
  JobTitle,
  PositionLevel,
  PositionType,
  JobGroup,
  Meeting,
  MeetingEmployee,
  Command,
  CommandEmployee,
  EmployeeJobHistory,
  Capacity,
  CapacityTrainingCourses,
  CapacityVectorCourses,
  CapacityEnvoccCourses,
  CapacityLawCourses,
  CapacityOtherExperiences
};
