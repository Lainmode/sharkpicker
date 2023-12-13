# SharkPicker

### An open-source datetime picker with a time picker based on Google's Material Design.



![image](https://github.com/Lainmode/sharkpicker/assets/44531827/373105e1-a8b5-4190-adb8-49edee804f31)
![image](https://github.com/Lainmode/sharkpicker/assets/44531827/18d30121-e3fa-4741-a128-9592354e5d3c)



### Dependencies:</br>
1- [JQuery](https://github.com/jquery/jquery)</br>
2- [moment.js](https://github.com/moment/moment)



### Usage:
```
<head>
  <link rel="stylesheet" href="sharkpicker/sharkpicker-0.0.1.css">
</head>
<body>
  <input type="datetime" id="DateTime">
  <div id="parentDiv></div>
  
  <!-- JQuery -->
  <!-- moment.js -->
  <script src="sharkpicker/sharkpicker-0.0.1.js"></script>

  <script>
    $(document).ready(function() {
      $("#parentDiv").sharkPicker({
        inputId: "DateTime", // can be anywhere in the DOM.
        popup:true, // optional, false by default.
        format: "DD/MM/YYYY HH:mm:ss", // optional, DD/MM/YYYY HH:mm:ss by default.
        showActionButtons: false // optional, true by default.
      });
    });
  </script>
</body>
```



The initializing element is where the SharkPicker will be created under. You may place it inside a popover or a modal of your choosing with the property **popup** set to **false**. 
Note: SharkPicker initialization will wipe any elements inside the initializing element.


| Property      | DataType    | Explanation  |
| ------------- |-------------| ------------ |
| inputId      | string | The ID of the input where the final datetime value will be set to. This input may be anywhere in the DOM. |
| popup      | boolean      |   Whether the SharkPicker should use its native popup behavior (not recommended (buggy)) |
| format | string      |   The DateTime format which will be used to format the final DateTime string that will be set to the input with the ID: **inputId**. It can be anything that is recognized by **moment.js** |
| showActionButtons      | boolean      |   Whether the SharkPicker should render the default **Discard** and **Save** buttons. Read below to learn how to make your own. |


### Functional Modification:</br>
You may employ your own **Discard** and **Save** buttons by setting **showActionButtons** to false during initialization and making your custom buttons call **discardSelection(element)** and **saveDateTime(element)** where **element** can be the parent element used to initialize the SharkPicker or any of its child elements. You may employ your own solutions after those function calls.

### Style Modifications:</br>
Currently, the only way to change the styling is by directly altering the element styles, or modifying sharkpicker.css.
