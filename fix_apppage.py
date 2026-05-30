import re

with open('src/pages/AppPage.jsx', 'r') as f:
    content = f.read()

# Very simple replace: for known function names in app.html
funcs = [
    'handleOverlayClick', 'closePincodeModal', 'onPincodeInput', 'lookupPincode', 
    'pickCity', 'useGPS', 'requestLocation', 'dismissLocBanner', 'openPincodeModal', 
    'toggleProfileDropdown', 'requireAuthThen', 'switchAppView', 'doLogout', 
    'openAuthModal', 'filterBarbers', 'setRating', 'submitReview', 'closeRatingModal',
    'closePanel', 'goToStep', 'selectPayment', 'handlePayment', 'bookAnother', 'viewMyBookings'
]

for func in funcs:
    content = content.replace(f" {func}(", f" window.{func}(")
    content = content.replace(f"{{{func}(", f"{{window.{func}(")

# Also fix `if(event.key==='Enter')` -> `if(e.key==='Enter')`
content = content.replace("if(event.key", "if(e.key")

with open('src/pages/AppPage.jsx', 'w') as f:
    f.write(content)
