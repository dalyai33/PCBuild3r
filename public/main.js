document.addEventListener('DOMContentLoaded', function () {
    // Allows the program to make sure the user wants to proceed with updating their profile
    const formByComponent = document.getElementById("formByComponent");
    const formByTotal = document.getElementById("formByTotal");
    const disclaimer = document.getElementById("disclaimer");
    const closeModal = document.getElementById("closeModal");

    let formToSubmit = null;

    // Handle form by component submissions
    formByComponent.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent the default submission
        formToSubmit = formByComponent; // Store the form to be submitted
        disclaimer.style.display = "block"; // Show the disclaimer popup
    });

    // Handle form by total submissions
    formByTotal.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent default submission
        formToSubmit = formByTotal; // Store the form to be submitted
        disclaimer.style.display = "block"; // Show the disclaimer popup
    });

    // Close the modal when the user clicks on <span> (x)
    closeModal.addEventListener("click", function () {
        disclaimer.style.display = "none"; // Hide the disclaimer
    });

    // Cancel the submission
    document.getElementById("cancelSave").addEventListener("click", function () {
        disclaimer.style.display = "none"; // Hide the disclaimer again
        formToSubmit = null; // Clear the form
    });

    // Send the submission
    document.getElementById("confirmSave").addEventListener("click", function () {
        disclaimer.style.display = "none"; // Hide the disclaimer
        // If the form is not null
        if (formToSubmit) {
            // Submit it
            formToSubmit.submit();
        }
    });
});