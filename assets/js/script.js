/**
 * @file HCS McMaster Christmas Party Event Page
 * @copyright Housing & Conference Services, McMaster University 2015
 * @author Yash Gopal (Front-end), Rade Kuruc (Back-end & Integration)
 */
//AJAX
var data = "";
/**
 * Handles AJAX calls. Takes 4 parameters which in sequence are listed below
 * @param {string} reqScript - File name of PHP script to send AJAX call to
 * @param {string} returnDataType - This can be either 'text' or 'json'
 * @param {object} reqData - This can be an array or JSON object to SEND to the script
 * @param {object} callback - The callback function if AJAX call is successful.
 */
function ajaxRequest(reqScript, returnDataType, reqData, callback) {
    $.ajax({
        type: "POST",
        dataType: returnDataType,
        url: reqScript,
        data: reqData,
        success: function (data) {
            callback(data);
        },
        fail: function () {
            console.log("AJAX request failed.");
        },
        error: function () {
            console.log("Error on server-side!");
        }
    });
}
//Globals
var party1 = 300;
var party1_details = "Party 1 - 9:00am to 11:00am";
var party2 = 300;
var party2_details = "Party 2 - 1:00pm to 3:00pm";
//Per Reg variables (temp)
var runningTotal = 0;
var children = 1;
var tax;
var totFin;
var regisData;
//Snowfall Refresh
function snowRefresh(){
    $(document).snowfall('clear');
    $(document).snowfall({flakeCount:60,maxSpeed:3,maxSize:3,flakeColor:'white',round:false});
}
//AJAX updated information on event page
/**
* Update the number of people registered for each party.
* @todo Use AJAX calls to change the capacity in the database temporarily and keep the numbers on the event page updated
*/
function updatePartyNumbers(){
    $("#registration > .time-block-wrapper > .time-block.one > #spotsLeft").text(party1 + ' spots left');
    $("#registration > .time-block-wrapper > .time-block.two > #spotsLeft").text(party2 + ' spots left');
}
//Messages
/**
* Updates Message in the registration helper bar
* @param {integer}pick - Chooses a certain message to display
* @param {integer}tim - Defines how long the message will display for
*/
function messageConsole(pick,tim){
    var oldMsg = $("#registrationHelper > #eventDetails").text();
    switch (pick){
        case 0:
            $("#registrationHelper > #eventDetails").text("Fill out any empty fields or correct the fields in red!").delay(tim).fadeOut();
            break;
        case 1:
            $("#registrationHelper > #eventDetails").text("Atleast 1 child is required to register.").delay(tim).fadeOut();
            break;
        default:
            $("#registrationHelper > #eventDetails").text("Something went wrong with registration. :( Try again later.)").delay(tim).fadeOut();
            break;
    }
    setTimeout(function(){
        $("#registrationHelper > #eventDetails").text(oldMsg).fadeIn();
    },tim+500);
}
//Validation
//Validation colors
/**
* Sets the form field color to red or green depending on the contents
* @param {string|integer|float} val - Value of a specific form field
* @param {regex} regEx - Regular Expression string to compare value with
* @param {object} obj - Form field to change color of
* @param {integer} mode - Can be 0 or 1. In Mode 0, regex is not used...instead you can define whether to set the field to red or green by sending a boolean through the regEx parameter
* @param {integer} locale - Can be 0 or 1. 0 sets the form fields parent element to a color while 1 sets the form field itself to a color.
*/
function validationColors(val,regEx,obj,mode,locale){
    if(mode==0){
        if(regEx==false){
            if(locale==1){
                $(obj).parent().css('background-color','pink');
            }else{
                $(obj).css('background-color','pink');
            }
        }else if(regEx==true){
            if(locale==1){
                $(obj).parent().css('background-color','#CBE896');
            }else{
                $(obj).css('background-color','#CBE896');
            }
        }
    }
    else if(regEx.test(val)){
        if(locale==1){
            $(obj).parent().css('background-color','#CBE896');
        }else{
            $(obj).css('background-color','#CBE896');
        }
    }else{
        if(locale==1){
            $(obj).parent().css('background-color','pink');
        }else{
            $(obj).css('background-color','pink');
        }
    }
}
/**
* All instant validation processes go here
* @param {integer} mode - If 0 is passed, regular validation processes are started. If any other number is passed, children validation processes are started
*/
function regisValidation(mode){
    if(mode==0){
        $("#registrationForm #step1 #fName").on('focusout',function(){
            var regX = /^[a-z|A-Z]+$/i; //First name No numbers or symbols allowed
            validationColors($(this).val(),regX,$(this),1,1);
        });
        $("#registrationForm #step1 #lName").on('focusout',function(){
            var regX = /^[a-z|A-Z]+$/i; //Last name No numbers or symbols allowed
            validationColors($(this).val(),regX,$(this),1,1);
        });
        $("#registrationForm #step1 #empID").on('focusout',function(){
            var regX = /^[0-9]+$/i; //Employee ID only numbers, any length
            var regX2 = /^\d{9}$/g; //Employee ID only numbers, specified length
            validationColors($(this).val(),regX,$(this),1,1);
        });
        $("#registrationForm #step1 #dept").on('focusout',function(){
            var regX = /^[a-z|A-Z|&|\s*]+$/i; //Multiple words, spaces allowed, only & symbol allowed
            validationColors($(this).val(),regX,$(this),1,1);
        });
        $("#registrationForm #step1 #email").on('focusout',function(){
            var regX = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g; //Standard Email
            validationColors($(this).val(),regX,$(this),1,1);
        });
        $("#registrationForm #step2 #addr").on('focusout',function(){
            var regX = /^[\w|&|\s*]+$/i;
            validationColors($(this).val(),regX,$(this),1,1);
        });
        $("#registrationForm #step2 #city").on('focusout',function(){
            var regX = /^[a-z|A-Z]+$/i;
            validationColors($(this).val(),regX,$(this),1,1);
        });
        $("#registrationForm #step2 #prov").on('focusout',function(){
            var regX = /^[a-z|A-Z]+$/i;
            validationColors($(this).val(),regX,$(this),1,1);
        });
        $("#registrationForm #step2 #postal").on('focusout',function(){
            var regX = /^[\w|&|\s*]+$/i;
            validationColors($(this).val(),regX,$(this),1,1);
        });
        $("#registrationForm #step2 #phone").on('focusout',function(){
            regX = /((?:\d{1}\s)?\(?(\d{3})\)?-?\s?(\d{3})-?\s?(\d{4})(\s?(x\d{5})))|((?:\d{1}\s)?\(?(\d{3})\)?-?\s?(\d{3})-?\s?(\d{4}))|(x?\d{5})/g; //Standard US/Canadian Phone # along with an optional 5 digit extension beginning with an 'x' appended to the end /w or /wo a space
            validationColors($(this).val(),regX,$(this),1,1);
        });
    }else{
        $(".child-forms #child1 #name").on('focusout',function(){
            var regX = /^[a-z|A-Z|\s*]+$/i; //First name and/or last name (with a space inbetween) No numbers or symbols allowed
            validationColors($(this).val(),regX,$(this),1,1);
        });
        $(".child-forms #child2 #name").on('focusout',function(){
            var regX = /^[a-z|A-Z|\s*]+$/i; //First name and/or last name (with a space inbetween) No numbers or symbols allowed
            validationColors($(this).val(),regX,$(this),1,1);
        });
        $(".child-forms #child3 #name").on('focusout',function(){
            var regX = /^[a-z|A-Z|\s*]+$/i; //First name and/or last name (with a space inbetween) No numbers or symbols allowed
            validationColors($(this).val(),regX,$(this),1,1);
        });
        $(".child-forms #child4 #name").on('focusout',function(){
            var regX = /^[a-z|A-Z|\s*]+$/i; //First name and/or last name (with a space inbetween) No numbers or symbols allowed
            validationColors($(this).val(),regX,$(this),1,1);
        });
    }
}
//Main Registration Stuff
/**
* Holds ALL registration form related functions. Turn them on or off here.
*/
function regisController(){
    regisLaunch();
    regisCancel();
    regisSteps();
    regisValidation(0);
}
/**
* Holds click event handlers for the two 'Register Now' buttons
*/
function regisLaunch(){
    $("#registerNow-party1").on('click',function(){
        $("#registration").hide();
        regisPartyOne();
    });
    $("#registerNow-party2").on('click',function(){
        $("#registration").hide();
        regisPartyTwo();
    });
}
/**
* Operations that happen AFTER the Party 1 'Register Now' button is clicked
*/
function regisPartyOne(){
    $("#registrationHelper > #eventDetails").text("You Selected: " + party1_details + ", Saturday November 28th, 2015.");
    regisData = {party:"1"};
    $("#registrationHelper > #runningTotal").text("");
    $("#registrationHelper").show();
    $("#registrationForm > #step1").show();
    $("#registrationForm").show();
}
/**
* Operations that should happen AFTER the Party 2 'Register Now' button is clicked
*/
function regisPartyTwo(){
    $("#registrationHelper > #eventDetails").text("You Selected: " + party2_details + ", Saturday November 28th, 2015.");
    regisData = {party:"2"};
    $("#registrationHelper > #runningTotal").text("");
    $("#registrationHelper").show();
    $("#registrationForm > #step1").show();
    $("#registrationForm").show();
}
/**
* Calculates the running totals on the registration helper bar
* @param {int} c - Number of Children added
*/
function regisHelperRunningTotal(c){
    runningTotal = 15.0*c;
    tax = Math.round(0.13*runningTotal * 100) / 100;
    totFin = tax+runningTotal;
    $("#registrationHelper > #runningTotal").html("Total: $" + runningTotal + " Tax: $" + tax.toFixed(2) + " <b>You Pay: $" + totFin.toFixed(2) +"</b>");
}
/**
* Adds a new child form to registration form.
* @example
* //Each new child form has its own unique ID of the form '#child<child number>'
* #child1 #child2
*/
function regisChildAdd(){
    if(children<=4){
        $("#child-form").clone().appendTo(".child-forms");
        $(".child-forms").find("#child-form:nth-of-type("+children+")").attr('id','child'+children);
        $("#child"+children).show();
        $("#child"+children).find("h4").text("Child " + children);
        regisHelperRunningTotal(children);
        children = children + 1;
        /*if(children==5){
            $("#registrationForm-addChild").hide();
        }*/
    }
}
/**
* Cancel button under registration form. All operations post-cancellation go here.
*/
function regisCancel(){
    $("#registrationForm-cancel").on('click',function(){
        $("#registration").slideDown();
        $("#registrationHelper > #runningTotal").text("");
        $("#registrationHelper").slideUp();
        $("#registrationForm").slideDown();
        $(".registrationFormNext").attr('id','next1');
        $("#registrationForm").hide();
        $("#registrationForm > #step3").hide();
        $("#registrationForm > #step2").hide();
        $("#registrationForm > #step1").show();
        $("#child1").remove();
        $("#child2").remove();
        $("#child3").remove();
        $("#child4").remove();
        runningTotal = 0;
        children = 1;
        tax = 0;
        totFin = 0;
        regisData = {};
    });
    $("#confirmationForm-cancel").on('click',function(){
        $("#confirmationForm #children").empty();
        $("#confirmationForm").hide();
        $("#registrationForm-cancel").trigger('click');
    });
}
/**
* Controls the steps to registration. Final connection is the link to the confirmation form.
*/
function regisSteps(){
    $(".registrationFormNext").on('click',function(){
        var regObj = $(this);
        if(regObj.attr('id')=='next1'){
            stepOneValidation(function(){
                regObj.attr('id','next2');
                $("#registrationForm > #step1").hide();
                $("#registrationForm > #step2").show();
            });
        }else if(regObj.attr('id')=='next2'){
            stepTwoValidation(function(numChild){
                regObj.attr('id','next3');
                for(var i=0;i<numChild;i++){
                    regisChildAdd();
                }
                regisValidation(1);
                $("#registrationForm > #step2").hide();
                $("#registrationForm > #step3").show();
            });
        }else if(regObj.attr('id')=='next3'){
            stepThreeValidation(function(){
                console.log(JSON.stringify(regisData));
                //Reset registration back to first state
                regObj.attr('id','next1');
                $("#registrationForm").hide();
                $("#registrationHelper").slideUp();
                $("#registrationForm > #step3").hide();
                $("#registrationForm > #step1").show();
                //Go to confirmation
                confirmation();
            });
        }
    });
}
/**
* Checks all other info including if form has atleast 1 child registered
* @todo Write the AJAX call to the database to verify client during step 1
* @param {object} callback - Callback function
*/
function stepOneValidation(callback){
    var regis_valid = false;
    var fields = ['#registrationForm #step1 #fName','#registrationForm #step1 #lName','#registrationForm #step1 #empID','#registrationForm #step1 #dept','#registrationForm #step1 #email'];
    for(var i=0;i<fields.length;i++){
        if(($(fields[i]).parent().css('background-color')=='rgb(203, 232, 150)')){
            regis_valid = true;
        }else{
            regis_valid = false;
            messageConsole(0,3500);
            break;
        }
    }
    if(regis_valid==true){
        $.extend(regisData,{fName:$(fields[0]).val(),lName:$(fields[1]).val(),empID:$(fields[2]).val(),dept:$(fields[3]).val(),email:$(fields[4]).val()});
        //TODO: Put an AJAX call here to verify if the registering client is part of faculty/on the list, then call the callback function
        callback();
    }

}
/**
* Checks all other parent info
* @param {object} callback - Callback function
*/
function stepTwoValidation(callback){
    var regis_valid = false;
    var fields = ['#registrationForm #step2 #addr','#registrationForm #step2 #city','#registrationForm #step2 #prov','#registrationForm #step2 #postal','#registrationForm #step2 #phone'];
    for(var i=0;i<fields.length;i++){
        if($(fields[i]).parent().css('background-color')=='rgb(203, 232, 150)'){
            regis_valid = true;
        }else{
            regis_valid = false;
            messageConsole(0,3500);
            break;
        }
    }
    if(regis_valid==true){
        $.extend(regisData,{addr:$(fields[0]).val(),city:$(fields[1]).val(),prov:$(fields[2]).val(),postal:$(fields[3]).val(),phone:$(fields[4]).val()});
        callback($('#registrationForm #step2 #numChild').val());
    }
}
/**
* Checks child info
* @param {object} callback - Callback function
*/
function stepThreeValidation(callback){
    var regis_valid = false;
    var fields = ['.child-forms #child1 #name','.child-forms #child2 #name','.child-forms #child3 #name','.child-forms #child4 #name'];
    for(var i=0;i<(children-1);i++){
        if($(fields[i]).parent().css('background-color')=='rgb(203, 232, 150)'){
            regis_valid = true;
        }else{
            regis_valid = false;
            messageConsole(0,3500);
            break;
        }
    }
    if(regis_valid==true){
        $.extend(regisData,{numOfChildren: children-1});
        $.extend(regisData,{children:[]});
        for(var i=0;i<(children-1);i++){
            var temp = {name:$('.child-forms #child'+(i+1)+' #name').val(),gender:$('.child-forms #child'+(i+1)+' #gender').val(),age:$('.child-forms #child'+(i+1)+' #age').val(),meal:$('.child-forms #child'+(i+1)+' #meal').val()};
            regisData.children.push(temp);
        }
        $.extend(regisData,{rawTotal:runningTotal,onlyTax:tax,finalTotal:totFin});
        callback();
    }
}
/**
* Generates confirmation details
*/
function confirmation(){
    $("#confirmationForm").show();
    snowRefresh();
    if(regisData.party==1){
        $("#confirmationForm #event").text(party1_details);
    }else{
        $("#confirmationForm #event").text(party2_details);
    }
    $("#confirmationForm #orderBy").html(regisData.fName+" "+regisData.lName+"<br/>"+regisData.dept+"<br/>"+regisData.addr+", "+regisData.city+", "+regisData.prov+" "+regisData.postal+"<br/>"+regisData.email+", "+regisData.phone);
    for(var i=1;i<=regisData.numOfChildren;i++){
        $("#confirmationForm #children").append("<h6><b>"+i+"</b></h6>"+regisData.children[i-1].name+", "+regisData.children[i-1].gender+", "+regisData.children[i-1].age+"yrs<br/>Food Preference: "+regisData.children[i-1].meal);
    }
    $("#confirmationForm #cost #beforeTax").text("$15 x "+regisData.numOfChildren+" = "+regisData.rawTotal.toFixed(2));
    $("#confirmationForm #cost #tax").text("13% HST = "+regisData.onlyTax.toFixed(2));
    $("#confirmationForm #cost #afterTax").text("$"+regisData.finalTotal.toFixed(2));
}
//Page load
$(document).ready(function () {
    regisController();
    updatePartyNumbers();
    snowRefresh();
});
