const JobTitle = require('../models/jobTitle');

exports.getAllJobTitles = async () => {
  return await JobTitle.findAll();
};

exports.getJobTitleById = async (id) => {
  return await JobTitle.findByPk(id);
};

exports.createJobTitle = async (data) => {
  return await JobTitle.create(data);
};

exports.updateJobTitle = async (id, data) => {
  const jobTitle = await JobTitle.findByPk(id);
  if (!jobTitle) return null;
  await jobTitle.update(data);
  return jobTitle;
};

exports.deleteJobTitle = async (id) => {
  const jobTitle = await JobTitle.findByPk(id);
  if (!jobTitle) return null;
  await jobTitle.destroy();
  return jobTitle;
};
