

11-09-2018
Since Im planning to use Mapbox for the location mapping in light of Google getting big headed about their maps API pricing, I needed to first eject the project from creat-react-native. Since Mapbox integration for React Native needs some Native code intervention. So I set about nervously ejecting the code, cause frankly the warnings are pretty intense, Anyways, Of course as expected, things didnt quite work after ejecting. But with considerable Googling and some configuration changes I got the app running. Trying the map integration resulted in the App crashing. Realised the target API in the fradle file had to be above 23, preferably 26 I suppose. That got the Map running phew.

02-09-2018
Integrated mocked up station data to just get a feel of the data flow, realistically. Mocked up data has the station names line no and coordiantes, to simulate the real type of data we're going to be using. Wired up the data to the components. So that the overlay accepts the data and when the station is selected, it is displayed back at the button. Also included alert for when someone gets cocky and tries select To before From (Idea : Perhaps auto detect nearest station(to be used as origin) based on location?)


01-09-2018
First screen now should have ideally, two fields, to hold start and end stations. I started adding the Picker component and took it for a test drive but errrr, felt too bound by the Android Native style rearing its head. I set about looking/thinking for/of an alternative. In the end I decided I'd put up an Overlay and display the stations there, and return the selected station back to the base. For this I used the React Native Elements Overlay component (yikes, its still in beta, but well, hoping it doesnt bite me in the butt later). 
Sucess Muhahaha, I got some sample list displaying on the overlay and able to return it back to the base and display on the 'picker' text.





31-08-2018 The First Things
So I set up the project using create-react-native-app and set about with the basic setup Id need.
Basically the idea being that once one has boarded the commute train for their journey, they key in their origin and destination and then doze off. Should wake the user up once they're nearing the station.
