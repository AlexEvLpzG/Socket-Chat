const miFormulario = document.querySelector( 'form' );

const url = ( window.location.hostname.includes( 'localhost' ) ) 
            ? 'http://localhost:4000/api/auth/' : 'url de server de producción';

miFormulario.addEventListener( 'submit', ( e ) => {
    e.preventDefault();
    const formData = {};

    for( let elements of miFormulario.elements ) {
        if( elements.name.length > 0 ) {
            formData[elements.name] = elements.value;
        }
    }

    fetch( url + 'login', {
        method: 'POST',
        body: JSON.stringify( formData ),
        headers: { 'Content-Type': 'application/json' }
    })
    .then( response => response.json() )
    .then(({ msg, token }) =>{
        if( msg ) {
            return console.error( msg );
        }

        localStorage.setItem( 'token', token );
    })
    .catch( error => console.log( error ))
});

function onSignIn( googleUser ) {
    //var profile = googleUser.getBasicProfile();

    var id_token = googleUser.getAuthResponse().id_token;
    const data = { id_token };

    fetch( url + 'google', {
        method: 'POST',
        headers: { 'Content-Type' : 'application/json' },
        body: JSON.stringify( data )
    }).then( resp => resp.json() )
    .then(({ token }) => {
        localStorage.setItem( 'token', token );
    })
    .catch( console.log ) 
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
}