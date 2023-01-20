function displayMessage(params) {
    let msg = document.getElementById("message").value;

    Swal.fire(
        {
            backdrop: false,
            title: "AppName",
            text: msg
        }
    )
}