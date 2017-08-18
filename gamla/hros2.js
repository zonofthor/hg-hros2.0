jQuery(document).ready(function($)
{
	$("#SelectDepartment > input[type='radio']").on("click", DepartmentChosen);
	$("#optAcute>input").on("click", toggleAcute);
	$("#optAmbulant>input").on("click", toggleAmbulant);
	$("#dtDate").on("change", DateChanged);
//	$("#dtTime").on("focus", dtTimeFocus);
	$("#dtTime").on("change", TimeChanged);
	$("#butFixTime").on("click", FixTime);
	$("#butVista").on("click", DoOrder);
	$("#butPanta").on("click", DoOrder);
//	$("#Reload").on("click", function() { location.reload(); });
});


function DepartmentChosen(ev)
{
//	$("#SelectDepartment>input").prop("disabled",true);
	$("#Hros20").show(200);
	$("#optOptions input").prop("checked",false);
	$("#Hros20").removeClass();
	$("#optOptions *").show();
	$("#butAction").attr("data-department", $(ev.delegateTarget).val());

	var dtCurrent = new Date();
	switch($(ev.delegateTarget).val())
	{
		case "LD":
			// default er Today()
			$("#dtDate").val(formatDate(dtCurrent));
			// finna í frh 08/11
			$("#dtDate").trigger("change");
			break;

		case "BMT":
			$("#optAcute>input").trigger("click");
			$("#dtDate").val(formatDate(dtCurrent));
			$("#dtTime").val(formatTime(dtCurrent));
			break;

		case "GDDD":
			$("#optAmbulant>input").trigger("click");
			break;

		case "HG":
			$("#optAmbulant>input").trigger("click");
			$("#optAcute").hide();
			break;
	}
}


function DateChanged()
{
	// ath jscript "villa" http://stackoverflow.com/questions/7244513/javascript-date-comparisons-dont-equal
	var dCurrent = new Date(new Date().setHours(0,0,0,0));		//  eina leiðin til að skila Date object með tíma settann á 00:00:00
	var tCurrent = new Date();								//	þurfum að hafa þessa aðskilda út af jscript date peculiarity, setHours skilar Integer en við viljum nota Date fyrir réttan samanburð
	var dtRequested = new Date($("#dtDate").val());

// == PARSE correct date
// ekki aftur í tímann
	if (dtRequested.getTime() < dCurrent.getTime())		// compare dates only
	{
		$("#dtDate").val(formatDate(dCurrent));
		void BlinkDate();
	}

// == SJÁLFVIRKNI: SETJA FIXED TÍMA EF LD
	if($("#SelectDepartment > input[type='radio']:checked").val() === "LD")
	{
	// en BARA EF TÍMI ÓSETTUR EÐA FIXED, EF CUSTOM TÍMI VALINN EKKERT INNGRIP
		if ($("#dtTime").val() === "" || $("#Hros20").hasClass("fixed"))
		{
		// UMBEÐINN DAGUR Í DAG => ÁKVEÐA 08/11 EFTIR TÍMA (ANNARS ALLTAF 08)
			if (dtRequested.getTime() === dCurrent.getTime())
			{
			// mán-fös: 1) kl 00-08 => 08:00 sama dag, kl 08-11 => 11:00 sama dag, kl 11-00 => 08:00 næsta dag		
				if (dCurrent.getDay() >= 1 && dCurrent.getDay() <= 5)
				{
					if(tCurrent.getHours() < 11)
					{
						$("#dtTime").val("11:00");
					}
					if(tCurrent.getHours() < 8)
					{
						$("#dtTime").val("08:00");
					}
					if(tCurrent.getHours() >= 11)
					{
						$("#dtTime").val("08:00");
						$("#dtDate").val(formatDate(new Date(dCurrent.setDate(dCurrent.getDate()+1))));
						void BlinkDate();
					}
				}
			// helgidagar: 1) kl 00-08 => 08:00 sama dag 2) 08-00 => 08:00 næsta dag
			// TODO: eftir að fínpússa sbr. helgidag 00-08
				if (dCurrent.getDay() > 5 && dCurrent.getDay() <= 7)
				{
					$("#dtDate").val(formatDate(new Date(dtCurrent.setDate(dCurrent.getDate()+1))));
					void BlinkDate();
					$("#dtTime").val("08:00");
				}
			}
			// AÐRA DAGA ALLTAF 08 (SAMA DAG)
			else
			{
				$("#dtTime").val("08:00");
			}
			void TimeChanged();
		}		
	}
}


function TimeChanged()
{
	if ($("#dtTime").val() === "08:00" || $("#dtTime").val() === "11:00")
	{
		$("#Hros20").addClass("fixed");
		$("#Hros20").removeClass("notfixed");
	}
	else
	{
		$("#Hros20").removeClass("fixed");
		$("#Hros20").addClass("notfixed");
		//$("#butFixTime").trigger("click");
	}
}


function toggleAcute(ev)
{
	if($("#optAcute>input").prop("checked"))
	{
	// ekki Brátt og Ambulant samtímis
		if ($("#optAmbulant>input").prop("checked"))
		{
			$("#optAmbulant>input").trigger("click");
		}
	}

	else
	{
		// BMT & GDDD: bara hægt að taka af hak ef Ambulant valið
		switch ($("#SelectDepartment > input[type='radio']:checked").val())
		{
			case "BMT":
			case "GDDD":
				if($("#optAmbulant>input").prop("checked") === false)
				{
					$("#optAcute>input").trigger("click");
				}
				break;
		}
	}

	void refreshCSSstates();
}

function toggleAmbulant(ev)
{
	if($("#optAmbulant>input").prop("checked"))
	{
		// Aldrei Fixed með Ambulant
		$("#Hros20").removeClass("fixed");

		// Bráða aldrei með Ambulant
		$("#optAcute>input").prop("checked", false);
	}

	else
	{
		switch($("#SelectDepartment > input[type='radio']:checked").val())
		{
			case "LD":
				$("#Hros20").addClass("fixed");
				$("#dtDate").trigger("change");	// Sjálfvirkni: reikna aftur út 08/11 tíma
				break;

			case "BMT":
				if($("#optAcute>input").prop("checked") === false)
				{
					$("#optAcute>input").trigger("click");
				}
				break;

			case "GDDD":
			case "HG":
				$("#optAmbulant>input").trigger("click");
				break;
		}
	}

// ekki Brátt og Ambulant samtímis
//	$("#optAcute>input").prop("checked", !$("#optAmbulant>input").prop("checked"));
	void refreshCSSstates();
}

function refreshCSSstates()
{
	$("#Hros20").toggleClass("acute", $("#optAcute>input").prop("checked"));
	$("#Hros20").toggleClass("ambulant", $("#optAmbulant>input").prop("checked"));	
}

function FixTime()
{
	$("#dtTime").val("");
	$("#dtDate").trigger("change");
}

// https://css-tricks.com/restart-css-animation/
function BlinkDate()
{
	$("#dtDate").removeClass("blikkar").width();
	$("#dtDate").addClass("blikkar");
}
function BlinkTime()
{
	// ?? þarf aldrei að blikka tíma þar sem css Fixed blikkar
	//$("#dtTime").removeClass("blikkar").width();
	//$("#dtTime").addClass("blikkar");
}

function formatDate(objDateTime)
{
	var dd = objDateTime.getDate();
	if(dd<10){dd='0'+dd;}
	var mm = objDateTime.getMonth()+1; //January is 0!
	if(mm<10){mm='0'+mm;}
	return (objDateTime.getFullYear() + "-" + mm + "-" + dd);
}
function formatTime(objDateTime)
{
	var hr = objDateTime.getHours();
	if(hr<10){hr='0'+hr;}
	var min = objDateTime.getMinutes();
	if(min<10){min='0'+min;}
	return (hr + ":" + min);
}


function DoOrder(ev)
{
	$("#CPOE").show();
	$("#CPOE *").html("");
	$("#CPOE_Staff1").html("DBÞ");
	$("#CPOE_Staff2").html("---");
	$("#CPOE_HROS").html("Blóð/kemía");
	$("#CPOE_dtOrdered").html(formatDate(new Date()) + " " + formatTime(new Date()));

	switch($(ev.delegateTarget).html())
	{
		case "Panta":
			$("#CPOE_Status").html("Lokið");
			$("#CPOE_Freetext").append("[pantað]");
			break;

		case "Vista":
			if($("#Hros20").hasClass("ambulant"))
			{
				$("#CPOE_Status").html("Í vinnslu").addClass("ivinnslu");
				$("#CPOE_Freetext").append("[ambulant]");
			}
			else
			{
				$("#CPOE_Status").html("Óunnið").addClass("ounnid");
				if($("#Hros20").hasClass("acute"))
				{
					$("#CPOE_Freetext").append("[brátt]");
				}
				$("#CPOE_Freetext").append("[deild]");
			}
			break;
	}
	

// dags & tími
	$("#CPOE_Freetext").append("[" + $("#dtDate").val() + " " + $("#dtTime").val() + "]");
	
	if ($("#MessageCPOE").val().length > 0)
	{
		$("#MessageCPOE").append(" - " + $("#MessageCPOE").val());
	}
}