function login(){
    loading_popup.classList.remove("hidden");
    return true;
}

var loadFile = function(event) {
    var image_preview = document.getElementById('image_preview');
    image_preview.src = URL.createObjectURL(event.target.files[0]);
    image_select_text.innerText = profile_image_input.value.replace(/C:\\fakepath\\/i, '')
    image_preview.onload = function() {
      URL.revokeObjectURL(image_preview.src) // free memory
    }
  };