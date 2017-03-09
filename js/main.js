$(document).ready(function () {

    $('#convertButton').click(function () {
        readFile();
    });

    $('#saveButton').click(function () {
        var blob = new Blob(["Hello, world!"], {type: "text/plain;charset=utf-8"});
        saveAs(blob, "hello world.txt");
    });
});

function readFile() 
{
    input = document.getElementById('fileInput');
    var file = input.files[0];

    if (file) 
    {
        var r = new FileReader();
        r.onload = function (e) 
        {
            var contents = e.target.result;
            xmlDoc = $.parseXML(contents);
            $xml = $(xmlDoc);
            alert("OK");
            var i = 0;
            var title = $(contents).find("kmloginfo\\:print_job_log").each(function () {
                console.log($(this).find("kmloginfo\\:job_kind").text());
                console.log($(this).find("kmloginfo\\:user_name").text());
                console.log($(this).find("kmloginfo\\:print_color_mode").text());
                i++;
            });
            console.log(i);
        }
        r.readAsText(file);
    } 
    else 
    {
        alert("Failed to load file");
    }
}