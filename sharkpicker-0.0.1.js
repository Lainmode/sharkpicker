var dateTimeFormat = "DD/MM/YYYY HH:mm:ss";

var sharkpickers = [];
var sharkpickersUnchanged = [];

$.fn.sharkPicker = function (options) {
	options = options ?? {};
	if (options.inputId == null) {
		throw new Error("Please provide a valid input id");
	}

	options.color = options.color ?? "#ff00ff";

	var elems =
		' <div class="sharkpicker"><input type="hidden" id="' +
		options.inputId +
		'" name="' +
		options.inputId +
		'"> <input id="sharkpicker-input" type="hidden"> <p style="margin-top:2px; margin-left:2px;color:gray; font-weight:bold;font-size:9pt">SELECT TIME</p> <div class="am-pm-container-vertical"> <div class="hour-minute-block-horizontal"> <input class="hour-minute-input hour-minute-input-selected" id="sharkpicker-h" type="text" value="12"> <h1 class="hour-minute-separator">:</h1> <input class="hour-minute-input" id="sharkpicker-m" type="text" value="0"> </div> <div class="am-pm-block-vertical"> <div class="am am-vertical am-pm am-pm-selected" data-modifier="1">AM</div> <div class="sharkpicker-vertical-line"></div> <div class="pm pm-vertical am-pm" data-modifier="2">PM</div> </div> </div> <div class="clocks-container"> <div class="clock" data-type="hour"> <div class="dot"></div> <div class="hand"></div> <div class="number number-selected" data-value="12">12</div> <div class="number" data-value="1">1</div> <div class="number" data-value="2">2</div> <div class="number" data-value="3">3</div> <div class="number" data-value="4">4</div> <div class="number" data-value="5">5</div> <div class="number" data-value="6">6</div> <div class="number" data-value="7">7</div> <div class="number" data-value="8">8</div> <div class="number" data-value="9">9</div> <div class="number" data-value="10">10</div> <div class="number" data-value="11">11</div> </div> <div class="clock" data-type="minute" style="display:none;"> <div class="dot"></div> <div class="hand"></div> <div class="number number-selected" data-value="12">0</div> <div class="number" data-value="1">5</div> <div class="number" data-value="2">10</div> <div class="number" data-value="3">15</div> <div class="number" data-value="4">20</div> <div class="number" data-value="5">25</div> <div class="number" data-value="6">30</div> <div class="number" data-value="7">35</div> <div class="number" data-value="8">40</div> <div class="number" data-value="9">45</div> <div class="number" data-value="10">50</div> <div class="number" data-value="11">55</div> </div> </div> <div class="sharkpicker-actions"> <h4 class="sharkpicker-discard-btn sharkpicker-action-btn" style="margin-right:20px; margin-bottom: 10px;">Discard</h4> <h4 class="sharkpicker-save-btn sharkpicker-action-btn" style="margin-right:10px;margin-bottom: 10px;">Save</h4> </div> </div>';

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

		this.innerHTML = elems;

		var $this = $(this);
		var initialInput = $this.find("#sharkpicker-input");
		var input = $this.find("#" + options.inputId);
		var hourClock = $this.find("[data-type='hour']");
		var minuteClock = $this.find("[data-type='minute']");

		var id = generateUID();

		options.dateTimeFormat = options.dateTimeFormat ?? dateTimeFormat;

		var sharkpicker = {
			id: id,
			element: $this,
			initialInput: initialInput,
			input: input,
			hourClock: hourClock,
			minuteClock: minuteClock,
			dateTimeFormat: options.dateTimeFormat,
			datetime: datetime,
			ampm: datetime.getHours() < 12 ? "am" : "pm",
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
	$(".number").on("click", function (event) {
		if (event.target.parentElement.dataset.type == "hour") {
			pickHour(event.target.parentElement, event.target);
		} else if (event.target.parentElement.dataset.type == "minute") {
			pickMinute(event.target.parentElement, event.target);
		}
	});

	$(".am").on("click", function (event) {
		var sharkpicker = sharkpickers.find(
			(e) =>
				e.id == $(event.target).closest("[data-shauid]").get(0).dataset.shauid
		);

		switchToAm(sharkpicker);
	});

	$(".pm").on("click", function (event) {
		var sharkpicker = sharkpickers.find(
			(e) =>
				e.id == $(event.target).closest("[data-shauid]").get(0).dataset.shauid
		);

		switchToPm(sharkpicker);
	});

	$(".hour-minute-input").on("focus", function (event) {
		var sharkpicker = sharkpickers.find(
			(e) =>
				e.id == $(event.target).closest("[data-shauid]").get(0).dataset.shauid
		);

		$(sharkpicker.element)
			.find(".hour-minute-input-selected")
			.removeClass("hour-minute-input-selected");

		if (event.target.id == "sharkpicker-m") {
			$(sharkpicker.element).find("[data-type='hour']").hide();
			$(sharkpicker.element).find("[data-type='minute']").show();
		} else if (event.target.id == "sharkpicker-h") {
			$(sharkpicker.element).find("[data-type='minute']").hide();
			$(sharkpicker.element).find("[data-type='hour']").show();
		}

		$(event.target).addClass("hour-minute-input-selected");
	});

	$(".hour-minute-input").on("change", function (event) {
		var sharkpicker = sharkpickers.find(
			(e) =>
				e.id == $(event.target).closest("[data-shauid]").get(0).dataset.shauid
		);

		if (event.target.id == "sharkpicker-m") {
			if (event.target.value >= 60) {
				event.target.value = 59;
			} else if (event.target.value < 0) {
				event.target.value = 0;
			}

			pickMinuteRaw(sharkpicker, event.target.value);
		} else if (event.target.id == "sharkpicker-h") {
			if (event.target.value > 12 && event.target.value < 24) {
				var value = event.target.value - 12;
				sharkpicker.datetime.setHours(value);
				event.target.value = value;
				switchToPm(sharkpicker, true);
			} else if (event.target.value >= 24 || event.target.value <= 0) {
				var value = 12;
				sharkpicker.datetime.setHours(value);
				event.target.value = value;
				switchToAm(sharkpicker, true);
			} else if (event.target.value > 0 && event.target.value < 13) {
				var value = event.target.value;
				sharkpicker.datetime.setHours(value);
				switchToAm(sharkpicker, true);
			}

			pickHour(
				sharkpicker.hourClock[0],
				$(sharkpicker.hourClock).find(
					"[data-value='" + event.target.value + "']"
				)[0]
			);
		}
	});

	$(".sharkpicker-discard-btn").on("click", function (event) {
		var sharkpicker = sharkpickers.find(
			(e) =>
				e.id == $(event.target).closest("[data-shauid]").get(0).dataset.shauid
		);

		var sharkpickerUnchanged = sharkpickersUnchanged.find(
			(e) =>
				e.id == $(event.target).closest("[data-shauid]").get(0).dataset.shauid
		);

		sharkpicker.datetime = new Date(sharkpickerUnchanged.datetime.getTime());
		sharkpicker.ampm = sharkpickerUnchanged.ampm.toString();

		pickMinuteRaw(sharkpicker, sharkpicker.datetime.getMinutes());

		var hr = sharkpicker.datetime.getHours();

		if (hr >= 12) {
			switchToPm(sharkpicker, true);
		} else {
			switchToAm(sharkpicker, true);
		}
	});

	$(".sharkpicker-save-btn").on("click", function (event) {
		var sharkpicker = sharkpickers.find(
			(e) =>
				e.id == $(event.target).closest("[data-shauid]").get(0).dataset.shauid
		);

		var sharkpickerUnchanged = sharkpickersUnchanged.find(
			(e) =>
				e.id == $(event.target).closest("[data-shauid]").get(0).dataset.shauid
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
	});
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
	var sharkpicker = sharkpickers.find(
		(e) =>
			e.id == $(clockElement).closest("[data-shauid]").get(0).dataset.shauid
	);
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
	var sharkpicker = sharkpickers.find(
		(e) =>
			e.id == $(clockElement).closest("[data-shauid]").get(0).dataset.shauid
	);

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
