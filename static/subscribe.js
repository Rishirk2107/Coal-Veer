function purchase(n){
    fetch("subscription/", {
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            // "Authorization": `Bearer ${API_KEY}`
        },
        body: new URLSearchParams({ user_selection: n })
    })
    .then(response => response.json())
        .then(data => {
            // Display a message to the user
            console.log(data)
            if (data.message>0){
                window.location.href="/payment"
            }
        })
        .catch(error => {
            console.error("Error:", error);
        });
}