(function($) {
    var form = $("#submitform"),
      fileNameLeft = $("#filename-left"),
      fileNameRight = $("#filename-right"),
      fileTextLeft = $("#text-left"),
      fileTextRight = $("#text-right"),
      singleResultArea = $("#single-result-area");
        
    form.submit(function(event) {
      event.preventDefault();
  
      var nameLeft = fileNameLeft.val();
      var nameRight = fileNameRight.val();
      var textLeft = fileTextLeft.val();
      var textRight = fileTextRight.val();
  
      if (nameLeft && nameRight && textLeft && textRight) {
        var requestConfig = {
          method: "POST",
          url: "/results",
          contentType: "application/json",
          data: JSON.stringify({
              file1name: nameLeft,
              file2name: nameRight,
              file1text: textLeft,
              file2text: textRight
          })
        };

        $.ajax(requestConfig).then(function(responseMessage) {
            console.log(responseMessage);
            var newElement = $(responseMessage);

            singleResultArea.empty();
            singleResultArea.append(newElement);
            
        });
      } else {
        singleResultArea.append()
      }
    });
  })(window.jQuery);
  