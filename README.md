


01-09-2018
First screen now should have ideally, two fields, to hold start and end stations. I started adding the Picker component and took it for a test drive but errrr, felt too bound by the Android Native style rearing its head. I set about looking/thinking for/of an alternative. In the end I decided I'd put up an Overlay and display the stations there, and return the selected station back to the base. For this I used the React Native Elements Overlay component (yikes, its still in beta, but well, hoping it doesnt bite me in the butt later). 
Sucess Muhahaha, I got some sample list displaying on the overlay and able to return it back to the base and display on the 'picker' text.





31-08-2018 The First Things
So I set up the project using create-react-native-app and set about with the basic setup Id need.
Basically the idea being that once one has boarded the commute train for their journey, they key in their origin and destination and then doze off. Should wake the user up once they're nearing the station.
