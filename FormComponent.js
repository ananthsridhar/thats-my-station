import React from 'react';
import { StyleSheet, Text, View,Dimensions,Picker,TouchableOpacity } from 'react-native';
import { Overlay } from 'react-native-elements';

export default class FormComponent extends React.Component {

  constructor(){
    super();
    this.state = {
      modalVisible : false,
      modalData : [],
      fromStation : ""
    }
    this.onPress = this.onPress.bind(this);
  }

  onPress(e){
    console.log(e);
    if(e==="from")
    {
      this.setState({
        modalData : [{
          text : 'Some1',
          value : 'sm1'
        },
        {
          text : 'Some2',
          value : 'sm2'
        }]
      })
    }
    else {
      this.setState({
        modalData : [{
          text : 'to1w',
          value : 'sm1'
        },
        {
          text : 'to2',
          value : 'sm2'
        }]
      })
    }
    this.setState({
      modalVisible : true
    })
  }

  render() {

    let modalData = this.state.modalData;
    return (
      <View>
        <View style={{width: Dimensions.get('window').width, height:Dimensions.get('window').height, backgroundColor: 'powderblue'}} >
          <View style={{padding:40}}>
            <Text>Hello</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={()=>this.onPress('to')}
              name="from"
            >
              <Text> {this.state.fromStation==""?"Touch Here":this.state.fromStation} </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={()=>this.onPress('to')}
              name="to"
            >
              <Text> {this.state.fromStation==""?"Touch Here":this.state.fromStation} </Text>
            </TouchableOpacity>
          </View>
        </View>
        <Overlay isVisible={this.state.modalVisible}
        onBackdropPress={() => this.setState({modalVisible: false})}>
        {    modalData.map((data,id)=>{
              return (
                <Text key={id}>{data.text}</Text>
              )
          })
        }
        </Overlay>
      </View>
    );
  }
}

class SelectorComponent extends React.Component{
  constructor()
  {
    super();
    this.onPress = this.onPress.bind(this);
  }



  render(){
    return (
      <TouchableOpacity
        style={styles.button}
        onPress={this.onPress}
      >
        <Text> Touch Here </Text>
      </TouchableOpacity>
    )
  }
}

class PickerComponent extends React.Component {
  constructor(props){
    super(props);
  }
  render(){
    return(
    <Picker
      selectedValue="java"
      style={{height: 50}}
      itemStyle={{ backgroundColor: "grey", color: "blue", fontFamily:"Ebrima", fontSize:17 }}
      >

  <Picker.Item label="JavaScript" value="js" />
</Picker>
);
  }
}

PickerComponent.defaultProps = {
  pickerData : [{
    text:"Default Data",
    value : "default"
  },
  {
    text:"Default Data",
    value : "default"
  }]
}


const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 5
  }
});
