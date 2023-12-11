var dateTimeFormat = "DD/MM/YYYY HH:mm:ss";

var sharkpickers = [];

$.fn.sharkPicker = function (options) {
	options = options ?? {};
	if (options.inputId == null) {
		throw new Error("Please provide a valid input id");
	}
	return this.each(function () {
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

		var $this = $(this);
		var input = $this.find("#sharkpicker-input");
		var hourClock = $this.find("[data-type='hour']");
		var minuteClock = $this.find("[data-type='minute']");

		var id = generateUID();

		options.dateTimeFormat = options.dateTimeFormat ?? dateTimeFormat;

		var sharkpicker = {
			id: id,
			element: $this,
			input: input,
			hourClock: hourClock,
			minuteClock: minuteClock,
			dateTimeFormat: options.dateTimeFormat,
			datetime: datetime,
			ampm: datetime.getHours() < 12 ? "am" : "pm",
		};

		this.dataset.shauid = id;
		input.val(moment(datetime).format(dateTimeFormat));
		sharkpickers.push(sharkpicker);

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
};

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
	sharkpicker.input.val(
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
