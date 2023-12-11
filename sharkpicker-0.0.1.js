var dateTimeFormat = "DD/MM/YYYY HH:mm:ss";

var sharkpickers = [];

$.fn.sharkPicker = function (options) {
	options = options ?? {};
	var datetime = new Date();
	return this.each(function () {
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
			ampm: "am",
		};

		this.dataset.shauid = id;
		input.val(moment(datetime).format(dateTimeFormat));
		sharkpickers.push(sharkpicker);
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

function switchToAm(sharkpicker) {
	if (sharkpicker.ampm == "am") {
		return;
	}
	sharkpicker.ampm = "am";

	sharkpicker.element.find(".pm").removeClass("am-pm-selected");
	sharkpicker.element.find(".am").addClass("am-pm-selected");

	pickHour(
		sharkpicker.hourClock[0],
		$(sharkpicker.hourClock).find(".number-selected")[0]
	);

	/* 	var numberElements = sharkpicker.element
		.find("[data-type='hour']")
		.find(".number");

	numberElements.each(function (element) {
		numberElements[element].innerHTML =
			parseInt(numberElements[element].innerHTML) - 12;
	}); */
}

function switchToPm(sharkpicker) {
	if (sharkpicker.ampm == "pm") {
		return;
	}
	sharkpicker.ampm = "pm";

	sharkpicker.element.find(".am").removeClass("am-pm-selected");
	sharkpicker.element.find(".pm").addClass("am-pm-selected");

	pickHour(
		sharkpicker.hourClock[0],
		$(sharkpicker.hourClock).find(".number-selected")[0]
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
	var value =
		sharkpicker.ampm == "am"
			? element.dataset.value == 12
				? 0
				: element.dataset.value
			: element.dataset.value == 12
			? 12
			: parseInt(element.dataset.value) + 12;

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

function pickMinute(clockElement, element) {
	var sharkpicker = sharkpickers.find(
		(e) =>
			e.id == $(clockElement).closest("[data-shauid]").get(0).dataset.shauid
	);
	var value = element.dataset.value == 12 ? 0 : element.dataset.value * 5;

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
