$(document).ready(function(){

  var template_html = $("#template_giorno").html();
  var template_function = Handlebars.compile(template_html);

  var initial_date = "2018-01-01";
  var final_date = "2018-12-01"

  var current_date = moment(initial_date);
  compila_mese(current_date);


  $(".prec").click(function(){
    if (current_date.isSameOrBefore(initial_date)) {
      $(this).attr("disabled",true);

    } else {
      current_date.subtract(1, "months");
      compila_mese(current_date);
      $(this).attr("disabled",false);
      $(".succ").attr("disabled",false);

    }
  });

  $(".succ").click(function(){
    if (current_date.isSameOrAfter(final_date))  {
      $(this).attr("disabled",true);

    } else {
      current_date.add(1, "months");
      compila_mese(current_date);
      $(this).attr("disabled",false);
      $(".prec").attr("disabled",false);

    }
  });


  function compila_mese(moment_date){

    $.ajax({
      url: "https://flynn.boolean.careers/exercises/api/holidays?year=2018&month=0",
      method: "GET",
      data: {
          "month": ((current_date.format("M")) - 1),
        },
      success: function (data, stato) {

        $(".calendario").empty();
        var giorni = moment_date.daysInMonth();
        var mese = moment_date.format("MMMM");
        var anno = moment_date.format("YYYY");

        $(".mese_corrente").text(mese + " " + anno);

        for (var i = 1; i <= giorni; i++) {
          var giorno = i + " " + mese;
          var variables_template = {
            "giorno_template": giorno,
            "giorno": moment_date.format("YYYY-MM-") + format_day(i),
            "class_festivita": ""
          };

          for (var j = 0; j < data.response.length; j++) {
            var context = {
              "nome": data.response[j].name,
              "data": data.response[j].date
            };

            if (context.data == variables_template.giorno) {
              variables_template.giorno_template = giorno + " - " + data.response[j].name;
              variables_template.class_festivita = "festivita";
            };
          };

          $(".calendario").append(template_function(variables_template));
        };

      },
      error: function () {
        alert("E' avvenuto un errore. Inserisci un numero corretto");
      }
    });
  }

  function format_day(day){
    if (day < 10) {
      day = "0" + day;
    };
    return day;
  };
});
