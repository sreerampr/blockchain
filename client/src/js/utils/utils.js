/**
 * @page lib/faq FAQ
 * @parent lib
 *
 * Checkout these frequently asked questions
 *
 * @body
 *
 * ## How to contribute to DocumentJS
 */
var React = require('react');
var moment = require('moment');
var Link = require('react-router').Link;
var notificationDelay = 7000;
var dummyCustomers = require('./customers');
var Web3 = require('web3');
var web3 = new Web3();
var provider = "http://10.208.95.22";
var SkipTraceContractAddress = "0x5af0669b0d83b52664847f41539b0b7954bea365";
var SkipTraceContractSequence = "contract Sequence { uint sequenceNo; function Sequence() { sequenceNo = 0; } function nextVal() returns (uint number) { return ++sequenceNo; } } contract CustomerDetails { struct CustomerData { uint customerID; address bankID; string profile; string phone; string addresses; string employer; string products; string remarks; uint timestamp; } mapping (uint => CustomerData) public custDataOf; } contract CustomerSkipTrace is Sequence, CustomerDetails { event SkipTraceAddEvent(uint customerID, address bankID, string profile, string phone, string addresses, string employer, string products, string remarks, uint timestamp); event SkipTraceQueryEvent(uint customerID, address bankID, string profile, string phone, string addresses, string employer, string products, string remarks, uint timestamp); event SkipTraceUpdateEvent(uint customerID, address bankID, string profile, string phone, string addresses, string employer, string products, string remarks, uint timestamp); event SkipTraceRecordCountEvent(uint recordCount); function addSkipTraceRecord(string profile, string phone, string addresses, string employer, string products, string remarks) { uint customerID = nextVal(); address bankID = msg.sender; uint timestamp = now; custDataOf[customerID].customerID = customerID; custDataOf[customerID].bankID = bankID; custDataOf[customerID].profile = profile; custDataOf[customerID].phone = phone; custDataOf[customerID].addresses = addresses; custDataOf[customerID].employer = employer; custDataOf[customerID].products = products; custDataOf[customerID].remarks = remarks; custDataOf[customerID].timestamp = timestamp; SkipTraceAddEvent(customerID, bankID, profile, phone, addresses, employer, products, remarks, timestamp); } function querySkipTraceRecord(uint customerID) { if (customerID>0 && customerID<=sequenceNo) SkipTraceQueryEvent(custDataOf[customerID].customerID, custDataOf[customerID].bankID, custDataOf[customerID].profile, custDataOf[customerID].phone, custDataOf[customerID].addresses, custDataOf[customerID].employer, custDataOf[customerID].products, custDataOf[customerID].remarks, custDataOf[customerID].timestamp); } function updateSkipTraceRecord(uint customerID, string profile, string phone, string addresses, string employer, string products, string remarks) { if (customerID>0 && customerID<=sequenceNo) { address bankID = msg.sender; uint timestamp = now; custDataOf[customerID].customerID = customerID; custDataOf[customerID].bankID = bankID; custDataOf[customerID].profile = profile; custDataOf[customerID].phone = phone; custDataOf[customerID].addresses = addresses; custDataOf[customerID].employer = employer; custDataOf[customerID].products = products; custDataOf[customerID].remarks = remarks; custDataOf[customerID].timestamp = timestamp; SkipTraceUpdateEvent(customerID, bankID, profile, phone, addresses, employer, products, remarks, timestamp); } } function reset() { for (uint i = 1; i<=sequenceNo; i++){ delete custDataOf[i]; } sequenceNo = 0; } function getRecordCount() { SkipTraceRecordCountEvent(sequenceNo); } }";
var SkipTraceCompiled;
var SkipTraceContract;
var updatePanelMessage = "Search for the user to update using the searchbar. You may search by Customer Id. You could also select a user to update from the recently updated list shown below.";
var viewPanelMessage = "Search for users using the searchbar. You may search by Customer Id. You could also select a user from the recently updated list shown below.";
var homePanelMessage = "";
var addPanelMessage = "";

module.exports = {
    homePanelMessage: homePanelMessage,
    addPanelMessage: addPanelMessage,
    updatePanelMessage: updatePanelMessage,
    viewPanelMessage: viewPanelMessage,
    dummyCustomers: dummyCustomers,
    getInitialState:{
        firstName: '',
        lastName: '',
        middleName: '',
        aliasName: '',
        dob: '',
        ssn: '',
        ssn2: '',
        ssn3: '',
        passportNumber: '',
        passportNumber2: '',
        passportNumber3: '',
        employerName1: '',
        employerName2:'',
        employerName3: '',
        productName1: '',
        productName2: '',
        productName3: '',
        remarks: '',
        mobilePhone1: '',
        mobilePhone2: '',
        mobilePhone3: '',
        homePhone1: '',
        homePhone2: '',
        homePhone3: '',
        workPhone1: '',
        workPhone2: '',
        workPhone3: '',
        currentAddress1: '',
        currentAddress2: '',
        currentAddress3: '',
        timestamp: '',
        userName: sessionStorage.getItem('username'),
        show: false,
        bankID: '',
        transactions: [],
        recentUpdations: [<div key={Math.random()} className="loader"></div>]
    },
    append: function(self) {
        self.setState({
            firstName: $('#firstName').val(),
            lastName: $('#lastName').val(),
            middleName: $('#middleName').val(),
            aliasName: $('#aliasName').val(),
            dob: $('#dob').val(),
            ssn: $('#ssn').val(),
            ssn2: $('#ssn2').val(),
            ssn3: $('#ssn3').val(),
            passportNumber: $('#passportNumber').val(),
            passportNumber2: $('#passportNumber2').val(),
            passportNumber3: $('#passportNumber3').val(),
            employerName1: $('#employerName1').val(),
            employerName2:$('#employerName2').val(),
            employerName3: $('#employerName3').val(),
            productName1: $('#productName1').val(),
            productName2: $('#productName2').val(),
            productName3: $('#productName3').val(),
            remarks: $('#remarks').val(),
            mobilePhone1: $('#mobilePhone1').val(),
            mobilePhone2: $('#mobilePhone2').val(),
            mobilePhone3: $('#mobilePhone3').val(),
            homePhone1: $('#homePhone1').val(),
            homePhone2: $('#homePhone2').val(),
            homePhone3: $('#homePhone3').val(),
            workPhone1: $('#workPhone1').val(),
            workPhone2: $('#workPhone2').val(),
            workPhone3: $('#workPhone3').val(),
            currentAddress1: $('#currentAddress1').val(),
            currentAddress2: $('#currentAddress2').val(),
            currentAddress3: $('#currentAddress3').val()
        });
    },
    populate: function(el, i, self, customers) {
        var id = (el)? +(el.target.id) : ((i)? i : 0);
        var singleCustomer;
        if(customers) {
            singleCustomer = customers[id];
        } else {
            $.ajax({
                async: false,
                url: 'http://localhost:3000/customers/'+id,
                method: 'GET',
                success: function(res) {
                    singleCustomer = res;
                }
            });
        }
        if(singleCustomer) {
            var overrideButtonId = "";
            var overrideButtonClass = "btn-disabled";
            if(singleCustomer.product3 == "1") {
                overrideButtonId = "#override-modal";
                overrideButtonClass = "btn-primary";
            }
            self.setState({
                customerID: singleCustomer.customerID,
                firstName: singleCustomer.firstName,
                lastName: singleCustomer.lastName,
                middleName: singleCustomer.middleName,
                aliasName: singleCustomer.aliasName,
                dob: moment(singleCustomer.DOB, 'D-MMM-YY').format('YYYY-MM-DD'),
                ssn: singleCustomer.SSN.substr(0,12),
                ssn2: singleCustomer.SSN.substr(12,12),
                ssn3: singleCustomer.SSN.substr(24,12),
                passportNumber: singleCustomer.passportNumber.substr(0,8),
                passportNumber2: singleCustomer.passportNumber.substr(9,8),
                passportNumber3: singleCustomer.passportNumber.substr(17,8),
                employerName1: singleCustomer.employer1,
                employerName2: singleCustomer.employer2,
                employerName3: singleCustomer.employer3,
                productName1: singleCustomer.product1,
                productName2: singleCustomer.product2,
                productName3: singleCustomer.product3,
                remarks: singleCustomer.remarks,
                mobilePhone1: singleCustomer.mobilePhone1,
                mobilePhone2: singleCustomer.mobilePhone2,
                mobilePhone3: singleCustomer.mobilePhone3,
                homePhone1: singleCustomer.homePhone1,
                homePhone2: singleCustomer.homePhone2,
                homePhone3: singleCustomer.homePhone3,
                workPhone1: singleCustomer.workPhone1,
                workPhone2: singleCustomer.workPhone2,
                workPhone3: singleCustomer.workPhone3,
                currentAddress1: singleCustomer.currentAddress1,
                currentAddress2: singleCustomer.currentAddress2,
                currentAddress3: singleCustomer.currentAddress3,
                timestamp: singleCustomer.timestamp,
                userName: sessionStorage.getItem('username'),
                show: true,
                bankID: singleCustomer.bankID,
                overrideButtonId: overrideButtonId,
                overrideButtonClass: overrideButtonClass
            });
        }
            return true;
    },
    search: function(self) {
        var searchTerm = self.refs.search.value.toLowerCase();
        self.refs.search.value = '';
        self.populate(null, searchTerm);
    },
    addSkipTraceRecordOnChain: function (firstName, middleName, lastName, aliasName, DOB, SSN, passportNumber, homePhone1, homePhone2, homePhone3, workPhone1, workPhone2, workPhone3, mobilePhone1, mobilePhone2, mobilePhone3, currentAddress1, currentAddress2, currentAddress3, employerName1, employerName2, employerName3, productName1, productName2, productName3, remarks) {
        var transHash;
        $.ajax({
            async: false,
            url: 'http://localhost:3000/customers/',
            method: 'POST',
            data: {
                port: sessionStorage.getItem('port'),
                coinBaseAddress: sessionStorage.getItem('coinBaseAddress'),
                firstName: firstName,
                middleName: middleName,
                lastName: lastName,
                aliasName: aliasName,
                DOB: DOB,
                SSN: SSN,
                passportNumber: passportNumber,
                homePhone1: homePhone1,
                homePhone2: homePhone2,
                homePhone3: homePhone3,
                workPhone1: workPhone1,
                workPhone2: workPhone2,
                workPhone3: workPhone3,
                mobilePhone1: mobilePhone1,
                mobilePhone2: mobilePhone2,
                mobilePhone3: mobilePhone3,
                currentAddress1: currentAddress1,
                currentAddress2: currentAddress2,
                currentAddress3: currentAddress3,
                employerName1: employerName1,
                employerName2: employerName2,
                employerName3: employerName3,
                productName1: productName1,
                productName2: productName2,
                productName3: productName3,
                remarks: remarks
            },
            success: function(res) {
                transHash = res;
            }
        });
        return transHash;
    },
    updateSkipTraceRecordOnChain: function (customerID, firstName, middleName, lastName, aliasName, DOB, SSN, passportNumber, homePhone1, homePhone2, homePhone3, workPhone1, workPhone2, workPhone3, mobilePhone1, mobilePhone2, mobilePhone3, currentAddress1, currentAddress2, currentAddress3, employerName1, employerName2, employerName3, productName1, productName2, productName3, remarks) {
        var transHash;
        $.ajax({
            async: false,
            url: 'http://localhost:3000/customers/'+customerID,
            method: 'PUT',
            data: {
                port: sessionStorage.getItem('port'),
                coinBaseAddress: sessionStorage.getItem('coinBaseAddress'),
                firstName: firstName,
                middleName: middleName,
                lastName: lastName,
                aliasName: aliasName,
                DOB: DOB,
                SSN: SSN,
                passportNumber: passportNumber,
                homePhone1: homePhone1,
                homePhone2: homePhone2,
                homePhone3: homePhone3,
                workPhone1: workPhone1,
                workPhone2: workPhone2,
                workPhone3: workPhone3,
                mobilePhone1: mobilePhone1,
                mobilePhone2: mobilePhone2,
                mobilePhone3: mobilePhone3,
                currentAddress1: currentAddress1,
                currentAddress2: currentAddress2,
                currentAddress3: currentAddress3,
                employerName1: employerName1,
                employerName2: employerName2,
                employerName3: employerName3,
                productName1: productName1,
                productName2: productName2,
                productName3: productName3,
                remarks: remarks
            },
            success: function(res) {
                transHash = res;
            }
        });
        return transHash;
    },
    web3Init: function() {
        var port = sessionStorage.getItem('port');
        web3.setProvider(new web3.providers.HttpProvider(provider+':'+port));
        web3.eth.defaultAccount = web3.eth.accounts[0];
        SkipTraceCompiled = web3.eth.compile.solidity(SkipTraceContractSequence);
        SkipTraceContract = web3.eth.contract(SkipTraceCompiled.CustomerSkipTrace.info.abiDefinition);
    },
    watchTransactionEvent: function(self) {
        console.log('Watching for transactions..');
        web3.eth.filter('latest').watch(function(){
            self.displayTransactions();
        });
    },
    watchAddEvent: function(self) {
        console.log('Watching for user add..');
        this.web3Init();
        var addEvent = SkipTraceContract.at(SkipTraceContractAddress).SkipTraceAddEvent();
        addEvent.watch(function(error, result){
            var blocks = +sessionStorage.getItem('blocks');
            var profile = result.args.profile.split('|');
            var firstName = profile[0].replace('firstName:','');
            var lastName = profile[2].replace('lastName:', '');
            if(blocks > 0 && result && result.blockNumber !== blocks) {
                $('.customer-added-alert').show();
                $('.customer-added-alert').html('Customer record ' + result.args.customerID.c[0] + ' ' + firstName + ' ' + lastName + ' ' + ' successfully created.');
                $('.customer-added-alert').delay(notificationDelay).fadeOut();
            }
            // addEvent.stopWatching();
            sessionStorage.setItem('blocks', result.blockNumber);
        });
    },
    watchUpdateEvent: function(self) {
        console.log('Watching for user updates..');
        this.web3Init();
        var updateEvent = SkipTraceContract.at(SkipTraceContractAddress).SkipTraceUpdateEvent();
        updateEvent.watch(function(error, result){
            var blocks = +sessionStorage.getItem('updateBlocks');
            var profile = result.args.profile.split('|');
            var firstName = profile[0].replace('firstName:','');
            var lastName = profile[2].replace('lastName:', '');
            if (blocks > 0 && result && result.blockNumber !== blocks) {
                $('.customer-updated-alert').show();
                $('.customer-updated-alert').html('Customer record ' + result.args.customerID.c[0] + ' ' + firstName + ' ' + lastName + ' ' + ' successfully overwritten.');
                $('.customer-updated-alert').delay(notificationDelay).fadeOut();
            }
            // updateEvent.stopWatching();
            sessionStorage.setItem('updateBlocks', result.blockNumber);
    	});
    },
    getRecentUpdations: function(self) {
        var recentUpdations = [
            <div className='row row-underline' key={Math.random()}>
                <div className='col-xs-1'>
                    <b>Id</b>
                </div>
                <div className='col-xs-4'>
                    <b>Name</b>
                </div>
                <div className='col-xs-3'>
                    <b>Last Updated By</b>
                </div>
                <div className='col-xs-4'>
                    <b>Last Updated at</b>
                </div>
            </div>
        ];
        $.ajax({
            // async: false,
            url: 'http://localhost:3000/customers',
            method: 'GET',
            data: {
                port: sessionStorage.getItem('port'),
                coinBaseAddress: sessionStorage.getItem('coinBaseAddress')
            },
            success: function(res) {
                res = res.sort(function(a, b) {
                    return b.timestamp - a.timestamp;
                });
                res.forEach(function(c) {
                    recentUpdations.push(
                        <div key={Math.random()} className='row row-underline'>
                            <div className='col-xs-1'>
                                {c.customerID}
                            </div>
                            <div className='col-xs-4'>
                                <a href='#' id={c.customerID} onClick={self.populate}>{c.firstName+' '+c.lastName}</a>
                            </div>
                            <div className='col-xs-3'>
                            <span className='bank-name'>{c.bankID}</span>
                            <img className='logo-small' src={'/images/'+c.bankID.toLowerCase().replace('_','')+'.png'}/>
                            </div>
                            <div className='col-xs-4'>
                            {moment.unix(c.timestamp).format("MM/DD/YYYY hh:mm:ss")}
                            </div>
                        </div>
                    );
                    self.setState({
                        recentUpdations: recentUpdations
                    });
                });
            }
        });
    }
};