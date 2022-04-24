const Payment = artifacts.require("Payment");
const DMVService = artifacts.require("DMVService");

module.exports = function(deployer) {
  deployer.deploy(Payment);
  deployer.deploy(DMVService);
};
