/**
 * Printer data XML2CSV converter
 * @Author: Filip Gulan
 * @Mail: raipergm34@gmail.com
 * @Website: http://www.raiper34.net
 */

/**
 * Document ready function
 */
$(document).ready(function () {
    
    $('#convertButton').click(function () { //button to start conversion from printer xml to csv
        xmlToCsv();
    });

    $("#fileInput").on('change', function () { //handle if there is file picked or not
        if($(this).val() === "")
        {
            $('#convertButton').addClass('disabled');
        }
        else
        {
            $('#convertButton').removeClass('disabled');
        }
    });
});

/**
 * Function to convert xml from input to csv
 * @returns {undefined}
 */
function xmlToCsv()
{
    input = document.getElementById('fileInput');
    var file = input.files[0];

    if (file) //if there is any file
    {
        var freader = new FileReader(); //for read xml from file
        data = new Array();
        freader.onload = function (e) //on load file from input
        {
            var contents = e.target.result; //xml string
            var data = new Array(); //xml data 
            var keys = new Array(); //keys because i can not iterate trought object using forEach...
            
            if($(contents).find("kmloginfo\\:result").length == 0) //if it is not xml file from printer
            {
                Materialize.toast('It is not valid xml file from printer!', 5000)
                return;
            }
            
            $(contents).find("kmloginfo\\:print_job_log").each(function () { //foreach print section
                var jobKind = $(this).find("kmloginfo\\:job_kind").text();
                var userName = $(this).find("kmloginfo\\:user_name").text();
                var printColorMode = $(this).find("kmloginfo\\:print_color_mode").text();
                var sum = $(this).find("kmloginfo\\:complete_pages").text();
                if (typeof data[jobKind + userName + printColorMode] === 'undefined') //if it is new index
                {
                    data[jobKind + userName + printColorMode] = new Array();
                    data[jobKind + userName + printColorMode]['jobKind'] = jobKind;
                    data[jobKind + userName + printColorMode]['userName'] = userName;
                    data[jobKind + userName + printColorMode]['printColorMode'] = printColorMode;
                    data[jobKind + userName + printColorMode]['sum'] = parseInt(sum);
                    keys.push(jobKind + userName + printColorMode);
                } 
                else //it is old index, we know this username jobkind and printcoormode so we only count papers to sum
                {
                    data[jobKind + userName + printColorMode]['sum'] += parseInt(sum);
                }
            });
            
            var csvString = "Jméno;Job_kind;Print_color_mode;Celkem\n";
            keys.forEach(function (element) { //create string from obtained data
                csvString += data[element]['userName'] + ";";
                csvString += data[element]['jobKind'] + ";";
                csvString += data[element]['printColorMode'] + ";";
                csvString += data[element]['sum'] + ";\n";
            });

            var blob = new Blob([csvString], {type: "text/csv;charset=utf-8"}); //to write to csv file
            saveAs(blob, "convertedCSV.csv");
        }
        freader.readAsText(file);
    }
}