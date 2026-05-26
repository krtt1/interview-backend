const JobGroup = require('../models/jobGroup');

exports.getAllJobGroups = async () => {
  return await JobGroup.findAll();
};

exports.getJobGroupById = async (id) => {
  return await JobGroup.findByPk(id);
};

exports.createJobGroup = async (data) => {
  return await JobGroup.create(data);
};

exports.updateJobGroup = async (id, data) => {
  const jobGroup = await JobGroup.findByPk(id);
  if (!jobGroup) return null;
  await jobGroup.update(data);
  return jobGroup;
};

exports.deleteJobGroup = async (id) => {
  const jobGroup = await JobGroup.findByPk(id);
  if (!jobGroup) return null;
  await jobGroup.destroy();
  return jobGroup;
};
