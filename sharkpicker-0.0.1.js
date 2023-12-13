var dateTimeFormat = "DD/MM/YYYY HH:mm:ss";
var date = new Date();

var sharkpickers = [];
var sharkpickersUnchanged = [];

var currentYear = date.getFullYear();
var currentMonth = date.getMonth();

$.fn.sharkPicker = function (options) {
	options = options ?? {};
	if (options.inputId == null) {
		throw new Error("Please provide a valid input id");
	}

	options.popup = options.popup ?? false;

	options.color = options.color ?? "#ff00ff";

	var sharkpickerContainer = options.popup ? "sharkpicker-container" : ""; 
	var sharkpickerPopup = options.popup ? "sharkpicker-popup" : ""; 
	var popupHidden = options.popup ? "style='display:none'" : "";


	var calendar = ' <div class="sharkpicker-calendarContainer"> <p style="margin-top:2px; margin-left:2px;color:gray; font-weight:bold;font-size:9pt">SELECT DATE</p> <div class="sharkpicker-controls"> <div class="sharkpicker-arrow" onclick="changeMonth(this, -1)">&#10094;</div> <div class="sharkpicker-monthYearContainer"> <h2 class="sharkpicker-monthYear sharkpicker-month"></h2> <h2 class="sharkpicker-monthYear sharkpicker-year"></h2> </div> <div class="sharkpicker-arrow" onclick="changeMonth(this, 1)">&#10095;</div> </div> <div class="sharkpicker-yearpicker" style="display: none;"> <div class="sharkpicker-yearpicker-controls"> <div class="sharkpicker-arrow" onclick="changeYearsRange(this, -1)">&#10094;</div> <h4 class="sharkpicker-decade-header" style="margin-top:4px;margin-bottom:4px;text-align:center;margin-left:14px; margin-right:14px;"></h4> <div class="sharkpicker-arrow" onclick="changeYearsRange(this, 1)">&#10095;</div> </div> <table style="width: 100%; text-align: center;"> <thead> <tr> <th> </th> <th> </th> <th></th> </tr> </thead> <div class="sharkpicker-vertical-line"></div> <tbody class="sharkpicker-yearpickerbody"> </tbody> </table> </div> <table class="sharkpicker-calendar"> <thead> <tr> <th>SUN</th> <th>MON</th> <th>TUE</th> <th>WED</th> <th>THU</th> <th>FRI</th> <th>SAT</th> </tr> </thead> <tbody class="sharkpicker-calendarBody"></tbody> </table> </div> <div class="sharkpicker-horizontal-line"></div>';

	var clock =
		' <input id="sharkpicker-input" type="hidden"> <p style="margin-top:2px; margin-left:2px;color:gray; font-weight:bold;font-size:9pt">SELECT TIME</p> <div class="am-pm-container-vertical"> <div class="hour-minute-block-horizontal"> <input class="hour-minute-input hour-minute-input-selected" id="sharkpicker-h" type="text" value="12"> <h1 class="hour-minute-separator">:</h1> <input class="hour-minute-input" id="sharkpicker-m" type="text" value="0"> </div> <div class="am-pm-block-vertical"> <div class="am am-vertical am-pm am-pm-selected" data-modifier="1">AM</div> <div class="sharkpicker-vertical-line"></div> <div class="pm pm-vertical am-pm" data-modifier="2">PM</div> </div> </div> <div class="clocks-container"> <div class="clock" data-type="hour"> <div class="dot"></div> <div class="hand"></div> <div class="number number-selected" data-value="12">12</div> <div class="number" data-value="1">1</div> <div class="number" data-value="2">2</div> <div class="number" data-value="3">3</div> <div class="number" data-value="4">4</div> <div class="number" data-value="5">5</div> <div class="number" data-value="6">6</div> <div class="number" data-value="7">7</div> <div class="number" data-value="8">8</div> <div class="number" data-value="9">9</div> <div class="number" data-value="10">10</div> <div class="number" data-value="11">11</div> </div> <div class="clock" data-type="minute" style="display:none;"> <div class="dot"></div> <div class="hand"></div> <div class="number number-selected" data-value="12">0</div> <div class="number" data-value="1">5</div> <div class="number" data-value="2">10</div> <div class="number" data-value="3">15</div> <div class="number" data-value="4">20</div> <div class="number" data-value="5">25</div> <div class="number" data-value="6">30</div> <div class="number" data-value="7">35</div> <div class="number" data-value="8">40</div> <div class="number" data-value="9">45</div> <div class="number" data-value="10">50</div> <div class="number" data-value="11">55</div> </div> </div> <div class="sharkpicker-actions"> <h4 class="sharkpicker-discard-btn sharkpicker-action-btn" style="margin-right:20px; margin-bottom: 10px;">Discard</h4> <h4 class="sharkpicker-save-btn sharkpicker-action-btn" style="margin-right:10px;margin-bottom: 10px;">Save</h4> </div> </div>';

	this.each(function () {
		var datetime = new Date();
		datetime.setSeconds(0);
		if (this.dataset.shauid != null) {
			console.log(
				'Sharkpicker with uid "' +
					this.dataset.shauid +
					'" has already been initialized.'
			);
			return;
		}

		this.innerHTML = '<div '+popupHidden+' class="'+sharkpickerContainer+'"><div class="sharkpicker ' + sharkpickerPopup + '">' + calendar + '<div >' + clock + '</div></div></div>';

		var $this = $(this);
		var calendarContainer = $(".sharkpicker-calendarContainer");
		var container = $(".sharkpicker-container");
		var initialInput = $this.find("#sharkpicker-input");
		var input = $("#" + options.inputId);
		var hourClock = $this.find("[data-type='hour']");
		var minuteClock = $this.find("[data-type='minute']");

		if(options.popup) {
			input.on("click", function() {
				container.show();
			});	
		}


		var id = generateUID();

		options.format = options.format ?? dateTimeFormat;

		var sharkpicker = {
			id: id,
			element: $this,
			sharkpickerContainer: container,
			calendarContainer: calendarContainer,
			initialInput: initialInput,
			input: input,
			hourClock: hourClock,
			minuteClock: minuteClock,
			dateTimeFormat: options.format,
			datetime: datetime,
			initialDate: new Date(datetime.getTime()),
			ampm: datetime.getHours() < 12 ? "am" : "pm",
			yearPickerVisible: false,
			isPopup: options.popup,
			yearRangeModifier: 0
		};

		var sharkpickerUnchanged = {
			id: sharkpicker.id.toString(),
			dateTimeFormat: options.dateTimeFormat.toString(),
			ampm: sharkpicker.ampm.toString(),
			datetime: new Date(datetime.getTime()),
		};

		this.dataset.shauid = id;
		initialInput.val(moment(datetime).format(dateTimeFormat));
		sharkpickers.push(sharkpicker);
		sharkpickersUnchanged.push(sharkpickerUnchanged);

		if (sharkpicker.ampm == "pm") {
			switchToPm(sharkpicker, true);
		}

		var hr = sharkpicker.datetime.getHours();
		var mn = sharkpicker.datetime.getMinutes();
		hr = hr > 12 ? hr - 12 : hr;
		var mnToClosestFive = Math.round(mn / 5) * 5;
		mnToClosestFive = mnToClosestFive == 0 ? 12 : mnToClosestFive / 5;

		showCalendar(sharkpicker);

		pickHour(hourClock[0], hourClock.find("[data-value='" + hr + "']")[0]);
		pickMinute(
			minuteClock[0],
			minuteClock.find("[data-value='" + mnToClosestFive + "']")[0],
			mn
		);
	});

	initEvents();
};

function initEvents() {
	$(".number")
		.off("click")
		.on("click", function (event) {
			if (event.currentTarget.parentElement.dataset.type == "hour") {
				pickHour(event.currentTarget.parentElement, event.currentTarget);
			} else if (event.currentTarget.parentElement.dataset.type == "minute") {
				pickMinute(event.currentTarget.parentElement, event.currentTarget);
			}
		});

	$(".am")
		.off("click")
		.on("click", function (event) {
			var sharkpicker = getSharkPickerFromElement(event.currentTarget);

			switchToAm(sharkpicker);
		});

	$(".pm")
		.off("click")
		.on("click", function (event) {
			var sharkpicker = sharkpickers.find(
				(e) =>
					e.id == $(event.currentTarget).closest("[data-shauid]").get(0).dataset.shauid
			);

			switchToPm(sharkpicker);
		});

	$(".hour-minute-input")
		.off("focus")
		.on("focus", function (event) {
			var sharkpicker = getSharkPickerFromElement(event.currentTarget);

			$(sharkpicker.element)
				.find(".hour-minute-input-selected")
				.removeClass("hour-minute-input-selected");

			if (event.currentTarget.id == "sharkpicker-m") {
				$(sharkpicker.element).find("[data-type='hour']").hide();
				$(sharkpicker.element).find("[data-type='minute']").show();
			} else if (event.currentTarget.id == "sharkpicker-h") {
				$(sharkpicker.element).find("[data-type='minute']").hide();
				$(sharkpicker.element).find("[data-type='hour']").show();
			}

			$(event.currentTarget).addClass("hour-minute-input-selected");
		});

	$(".hour-minute-input")
		.off("change")
		.on("change", function (event) {
			var sharkpicker = getSharkPickerFromElement(event.currentTarget);

			if (event.currentTarget.id == "sharkpicker-m") {
				if (event.currentTarget.value >= 60) {
					event.currentTarget.value = 59;
				} else if (event.currentTarget.value < 0) {
					event.currentTarget.value = 0;
				}

				pickMinuteRaw(sharkpicker, event.currentTarget.value);
			} else if (event.currentTarget.id == "sharkpicker-h") {
				if (event.currentTarget.value > 12 && event.currentTarget.value < 24) {
					var value = event.currentTarget.value - 12;
					sharkpicker.datetime.setHours(value);
					event.currentTarget.value = value;
					switchToPm(sharkpicker, true);
				} else if (event.currentTarget.value >= 24 || event.currentTarget.value <= 0) {
					var value = 12;
					sharkpicker.datetime.setHours(value);
					event.currentTarget.value = value;
					switchToAm(sharkpicker, true);
				} else if (event.currentTarget.value > 0 && event.currentTarget.value < 13) {
					var value = event.currentTarget.value;
					sharkpicker.datetime.setHours(value);
					switchToAm(sharkpicker, true);
				}

				pickHour(
					sharkpicker.hourClock[0],
					$(sharkpicker.hourClock).find(
						"[data-value='" + event.currentTarget.value + "']"
					)[0]
				);
			}
		});

	$(".sharkpicker-discard-btn")
		.off("click")
		.on("click", function (event) {
			discardSelection(event.currentTarget);
		});

	$(".sharkpicker-save-btn")
		.off("click")
		.on("click", function (event) {
			saveDateTime(event.currentTarget);
		});

	$(".sharkpicker-year").off("click").on("click", function(event) {
		var sharkpicker = sharkpickers[0]; // HACK
		if(sharkpicker.yearPickerVisible) {
			hideYearPicker(sharkpicker);
			sharkpicker.yearRangeModifier = 0;
		}
		else {
			showYears(sharkpicker, sharkpicker.datetime.getFullYear());
			showYearPicker(sharkpicker);
		}


	});
}

function discardSelection(element) {
	var sharkpicker = getSharkPickerFromElement(element);

	var sharkpickerUnchanged = sharkpickersUnchanged.find(
		(e) =>
			e.id == $(element).closest("[data-shauid]").get(0).dataset.shauid
	);

	sharkpicker.datetime = new Date(sharkpickerUnchanged.datetime.getTime());
	sharkpicker.initialDate = new Date(sharkpicker.datetime.getTime());
	sharkpicker.ampm = sharkpickerUnchanged.ampm.toString();

	pickMinuteRaw(sharkpicker, sharkpicker.datetime.getMinutes());
	showCalendar(sharkpicker);
	var hr = sharkpicker.datetime.getHours();

	if (hr >= 12) {
		switchToPm(sharkpicker, true);
	} else {
		switchToAm(sharkpicker, true);
	}
	
	if(sharkpicker.isPopup) {
		$(sharkpicker.sharkpickerContainer).hide();
	}
}

function saveDateTime(element) {
	var sharkpicker = getSharkPickerFromElement(element);

	var sharkpickerUnchanged = sharkpickersUnchanged.find(
		(e) =>
			e.id == $(element).closest("[data-shauid]").get(0).dataset.shauid
	);

	var newDateTime = new Date(sharkpicker.datetime.getTime());

	if (sharkpicker.ampm == "pm" && newDateTime.getHours() < 12) {
		newDateTime.setHours(newDateTime.getHours() + 12);
	} else if (sharkpicker.ampm == "am" && newDateTime.getHours() == 12) {
		newDateTime.setHours(0);
	}

	$(sharkpicker.input).val(
		moment(newDateTime).format(sharkpicker.dateTimeFormat)
	);

	sharkpickerUnchanged.dateTimeFormat = sharkpicker.dateTimeFormat;
	sharkpickerUnchanged.datetime = new Date(newDateTime.getTime());
	sharkpickerUnchanged.ampm = sharkpicker.ampm.toString();

	if(sharkpicker.isPopup) {
		$(sharkpicker.sharkpickerContainer).hide();
	}
}

function hideYearPicker(sharkpicker) {
	$(sharkpicker.calendarContainer).find(".sharkpicker-yearpicker").hide();
	sharkpicker.yearPickerVisible = false;
}

function showYearPicker(sharkpicker) {
	$(sharkpicker.calendarContainer).find(".sharkpicker-yearpicker").show();
	sharkpicker.yearPickerVisible = true;
}

function getSharkPickerFromElement(element) {
	var sharkpicker = sharkpickers.find(
		(e) => e.id == $(element).closest("[data-shauid]").get(0).dataset.shauid
	);

	return sharkpicker;
}

function pickMinuteRaw(sharkpicker, value) {
	var mnToClosestFive = Math.round(value / 5) * 5;
	mnToClosestFive = mnToClosestFive == 0 ? 12 : mnToClosestFive / 5;

	pickMinute(
		sharkpicker.minuteClock[0],
		$(sharkpicker.minuteClock).find(
			"[data-value='" + mnToClosestFive + "']"
		)[0],
		value
	);
}

function switchToAm(sharkpicker, force) {
	force = force ?? false;
	if (sharkpicker.ampm == "am" && !force) {
		return;
	}
	sharkpicker.ampm = "am";

	sharkpicker.element.find(".pm").removeClass("am-pm-selected");
	sharkpicker.element.find(".am").addClass("am-pm-selected");

	var hr = sharkpicker.datetime.getHours();
	hr = hr > 12 ? hr - 12 : hr;

	pickHour(
		sharkpicker.hourClock[0],
		$(sharkpicker.hourClock).find("[data-value='" + hr + "']")[0]
	);

	/* 	var numberElements = sharkpicker.element
		.find("[data-type='hour']")
		.find(".number");

	numberElements.each(function (element) {
		numberElements[element].innerHTML =
			parseInt(numberElements[element].innerHTML) - 12;
	}); */
}

function switchToPm(sharkpicker, force) {
	force = force ?? false;
	if (sharkpicker.ampm == "pm" && !force) {
		return;
	}
	sharkpicker.ampm = "pm";

	sharkpicker.element.find(".am").removeClass("am-pm-selected");
	sharkpicker.element.find(".pm").addClass("am-pm-selected");

	var hr = sharkpicker.datetime.getHours();
	hr = hr > 12 ? hr - 12 : hr;

	pickHour(
		sharkpicker.hourClock[0],
		$(sharkpicker.hourClock).find("[data-value='" + hr + "']")[0],
		hr
	);
	/* 	var numberElements = sharkpicker.element
		.find("[data-type='hour']")
		.find(".number");

	numberElements.each(function (element) {
		numberElements[element].innerHTML =
			parseInt(numberElements[element].innerHTML) + 12;
	}); */
}

function pickHour(clockElement, element) {
	var sharkpicker = getSharkPickerFromElement(clockElement);
	/* 	var value =
		sharkpicker.ampm == "am"
			? element.dataset.value == 12
				? 0
				: element.dataset.value
			: element.dataset.value == 12
			? 12
			: parseInt(element.dataset.value) + 12; */

	var value = element.dataset.value;

	sharkpicker.datetime.setHours(value);

	var selectedNumbers = $(clockElement).find(".number-selected");

	$(sharkpicker.element).find("#sharkpicker-h").val(value);

	if (selectedNumbers != null) {
		selectedNumbers.each(function (selectedNumber) {
			$(selectedNumbers[selectedNumber]).removeClass("number-selected");
		});
	}
	var hand = $(clockElement).find(".hand");
	rotateHand(hand, element.dataset.value);

	$(element).addClass("number-selected");

	updateDateTimeInput(sharkpicker);
}

function pickMinute(clockElement, element, value) {
	var sharkpicker = getSharkPickerFromElement(clockElement);

	value =
		value ?? (element.dataset.value == 12 ? 0 : element.dataset.value * 5);

	sharkpicker.datetime.setMinutes(value);

	var selectedNumbers = $(clockElement).find(".number-selected");

	$(sharkpicker.element).find("#sharkpicker-m").val(value);

	if (selectedNumbers != null) {
		selectedNumbers.each(function (selectedNumber) {
			$(selectedNumbers[selectedNumber]).removeClass("number-selected");
		});
	}
	var hand = $(clockElement).find(".hand");

	rotateHand(hand, element.dataset.value);

	$(element).addClass("number-selected");

	updateDateTimeInput(sharkpicker);
}

function updateDateTimeInput(sharkpicker) {
	sharkpicker.initialInput.val(
		moment(sharkpicker.datetime).format(sharkpicker.dateTimeFormat)
	);
}

function rotateHand(hand, value) {
	$(hand).css("rotate", ((12 - parseInt(value)) * -30).toString() + "deg");
}

function generateUID() {
	var firstPart = (Math.random() * 46656) | 0;
	var secondPart = (Math.random() * 46656) | 0;
	firstPart = ("000" + firstPart.toString(36)).slice(-3);
	secondPart = ("000" + secondPart.toString(36)).slice(-3);
	return firstPart + secondPart;
}

function getTextColor(hexcolor) {
	var r = parseInt(hexcolor.substring(1, 3), 16);
	var g = parseInt(hexcolor.substring(3, 5), 16);
	var b = parseInt(hexcolor.substring(5, 7), 16);
	var yiq = (r * 299 + g * 587 + b * 114) / 1000;
	return yiq >= 128 ? "black" : "white";
}

function shadeColor(color, percent) {
	var R = parseInt(color.substring(1, 3), 16);
	var G = parseInt(color.substring(3, 5), 16);
	var B = parseInt(color.substring(5, 7), 16);

	R = parseInt((R * (100 + percent)) / 100);
	G = parseInt((G * (100 + percent)) / 100);
	B = parseInt((B * (100 + percent)) / 100);

	R = R < 255 ? R : 255;
	G = G < 255 ? G : 255;
	B = B < 255 ? B : 255;

	R = Math.round(R);
	G = Math.round(G);
	B = Math.round(B);

	var RR = R.toString(16).length == 1 ? "0" + R.toString(16) : R.toString(16);
	var GG = G.toString(16).length == 1 ? "0" + G.toString(16) : G.toString(16);
	var BB = B.toString(16).length == 1 ? "0" + B.toString(16) : B.toString(16);

	return "#" + RR + GG + BB;
}

function showCalendar(sharkpicker) {
	var month = sharkpicker.initialDate.getMonth();
	var year = sharkpicker.initialDate.getFullYear();

	var firstDay = new Date(year, month).getDay();
	var daysInMonth = 32 - new Date(year, month, 32).getDate();

	var tbl = $(sharkpicker.calendarContainer).find(".sharkpicker-calendarBody")[0];
	tbl.innerHTML = "";

	$(sharkpicker.calendarContainer).find(".sharkpicker-month")[0].innerHTML = months[month].substring(0,3).toUpperCase();
	$(sharkpicker.calendarContainer).find(".sharkpicker-year")[0].innerHTML = year;


	var date = 1;
	for (var i = 0; i < 6; i++) {
		var row = document.createElement("tr");

		for (var j = 0; j < 7; j++) {
			if (i === 0 && j < firstDay) {
				var cell = document.createElement("td");
				var cellText = document.createTextNode("");
				cell.appendChild(cellText);
				row.appendChild(cell);
			} else if (date > daysInMonth) {
				break;
			} else {
				var cell = document.createElement("td");
				var cellContent = document.createElement("div");
				var cellText = document.createTextNode(date);
				if (
					date === today.getDate() &&
					year === today.getFullYear() &&
					month === today.getMonth()
				) {
					cellContent.classList.add("sharkpicker-today");
				}

				if(date == sharkpicker.datetime.getDate() && month == sharkpicker.datetime.getMonth() && year == sharkpicker.datetime.getFullYear()) {
					cellContent.classList.add("sharkpicker-calendar-cell-content-selected");
				}
				else if (date == sharkpicker.datetime.getDate()) {
					cellContent.classList.add("sharkpicker-calendar-cell-content-hover");
				}
				cell.classList.add("sharkpicker-day");
				$(cell).on("click", function(event) {selectDay(event.currentTarget)});
				cell.dataset.value = date;
				cellContent.classList.add("sharkpicker-calendar-cell-content");
				cell.appendChild(cellContent);
				cellContent.appendChild(cellText);
				row.appendChild(cell);
				date++;
			}
		}

		tbl.appendChild(row);
	}
}

function showYears(sharkpicker, selectedYear) {
    const startYear = selectedYear - (selectedYear % 10);
    var tableBody = $(sharkpicker.calendarContainer).find(".sharkpicker-yearpickerbody")[0];

    tableBody.innerHTML = '';
    var row = document.createElement('tr');

	$(sharkpicker.calendarContainer).find(".sharkpicker-decade-header").html(startYear+"s")

    for (var year = startYear; year < startYear + 10; year++) {
        var cell = document.createElement('td');
		var cellContent = document.createElement("div");
		cell.classList.add("sharkpicker-year-td");
		cell.dataset.value = year;
		cellContent.classList.add("sharkpicker-year-content");
        cellContent.textContent = year;

		$(cell).on("click", function(event) {
			selectYear(event.currentTarget);
		});

		if(year == today.getFullYear()) {
			cellContent.classList.add("sharkpicker-year-current");
		}

		if(year == sharkpicker.datetime.getFullYear()) {
			cellContent.classList.add("sharkpicker-year-content-selected");

		}

		cell.appendChild(cellContent);
        row.appendChild(cell);

        if ((year - startYear) % 3 === 2) {
            tableBody.appendChild(row);
            row = document.createElement('tr');
        }
    }

    if (row.hasChildNodes()) {
        tableBody.appendChild(row);
    }

}

function changeMonth(element, step) {
	var sharkpicker = sharkpickers[0]; // HACK

	var month = sharkpicker.initialDate.getMonth();
	var year = sharkpicker.initialDate.getFullYear()

	sharkpicker.initialDate.setMonth(month + step);
	if (month < 0 || month > 11) {
		sharkpicker.initialDate.setYear(year += month > 11 ? 1 : -1);
		sharkpicker.initialDate.setMonth((month + 12) % 12);
	}
	showCalendar(sharkpicker);
}

function changeMonthWithSharkPicker(sharkpicker, step) {

	var month = sharkpicker.initialDate.getMonth();
	var year = sharkpicker.initialDate.getFullYear()

	sharkpicker.initialDate.setMonth(month + step);
	if (month < 0 || month > 11) {
		sharkpicker.initialDate.setYear(year += month > 11 ? 1 : -1);
		sharkpicker.initialDate.setMonth((month + 12) % 12);
	}
	showCalendar(sharkpicker);
}


function changeYearsRange(element, step) {
	var sharkpicker = sharkpickers[0]; // HACK

	sharkpicker.yearRangeModifier+=step;

	var year = sharkpicker.initialDate.getFullYear() + (sharkpicker.yearRangeModifier*10);
	showYears(sharkpicker, year);
}

function selectDay(element) {
	// var sharkpicker = getSharkPickerFromElement(event.currentTarget);
	var sharkpicker = sharkpickers[0]; // HACK

	var day = element.dataset.value;
	sharkpicker.datetime.setDate(day);
	sharkpicker.datetime.setMonth(sharkpicker.initialDate.getMonth());
	sharkpicker.datetime.setYear(sharkpicker.initialDate.getFullYear());

	sharkpicker.initialDate = new Date(sharkpicker.datetime.getTime());

	updateDateTimeInput(sharkpicker);

	$(sharkpicker.calendarContainer).find(".sharkpicker-calendar-cell-content-selected").removeClass("sharkpicker-calendar-cell-content-selected");
	$(sharkpicker.calendarContainer).find(".sharkpicker-calendar-cell-content-hover").removeClass("sharkpicker-calendar-cell-content-hover");

	$(element).find(".sharkpicker-calendar-cell-content").addClass("sharkpicker-calendar-cell-content-selected");
}

function selectDayRaw(day) {
	// var sharkpicker = getSharkPickerFromElement(event.currentTarget);
	var sharkpicker = sharkpickers[0]; // HACK

	sharkpicker.datetime.setDate(day);

	updateDateTimeInput(sharkpicker);

	$(sharkpicker.calendarContainer).find(".sharkpicker-calendar-cell-content-selected").removeClass("sharkpicker-calendar-cell-content-selected");
	$(element).find(".sharkpicker-calendar-cell-content").addClass("sharkpicker-calendar-cell-content-selected");
}


function selectYear(element) {
	// var sharkpicker = getSharkPickerFromElement(event.currentTarget);
	var sharkpicker = sharkpickers[0]; // HACK

	var year = element.dataset.value;
	sharkpicker.initialDate.setYear(year);

	updateDateTimeInput(sharkpicker);

	$(sharkpicker.calendarContainer).find(".sharkpicker-year-content").removeClass("sharkpicker-year-content-selected");
	$(element).find(".sharkpicker-year-content").addClass("sharkpicker-year-content-selected");
	$(sharkpicker.calendarContainer).find(".sharkpicker-year").html(year);

	hideYearPicker(sharkpicker);

	showCalendar(sharkpicker);
}

function selectYearRaw(year) {
	// var sharkpicker = getSharkPickerFromElement(event.currentTarget);
	var sharkpicker = sharkpickers[0]; // HACK

	sharkpicker.datetime.setYear(year);

	updateDateTimeInput(sharkpicker);

	$(sharkpicker.calendarContainer).find(".sharkpicker-year").html(year);

	hideYearPicker(sharkpicker);
}



const months = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];
const today = new Date();
