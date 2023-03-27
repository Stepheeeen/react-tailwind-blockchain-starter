const LandManagement = artifacts.require("LandManagement");

module.exports = function (deployer) {
  deployer.deploy(LandManagement);
};
