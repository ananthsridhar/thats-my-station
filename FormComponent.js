import React from 'react';
import { StyleSheet, Text, View,Dimensions,Picker,TouchableOpacity } from 'react-native';
import { Overlay } from 'react-native-elements';

export default class FormComponent extends React.Component {

  constructor(){
    super();
    this.state = {
      modalVisible : false,
      modalData : [],
      whichModal : "",
      fromStation : "",
      toStation:""
    }
    this.onPress = this.onPress.bind(this);
    this.setStation = this.setStation.bind(this);
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
        }],
        whichModal : "from"
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
        }],
        whichModal : "to"
      })
    }
    this.setState({
      modalVisible : true
    })
  }

  setStation(stationId){
    console.log("Form Component" + stationId);
  }

  render() {

    let modalData = this.state.modalData;
    return (
      <View>
        <View style={{width: Dimensions.get('window').width, height:Dimensions.get('window').height, backgroundColor: 'powderblue'}} >
          <View style={{padding:40}}>
            <Text>Hello</Text>
            <View style={{padding:40}}>
              <TouchableOpacity
                style={styles.button}
                onPress={()=>this.onPress('from')}
                name="from"
              >
                <Text> {this.state.fromStation==""?"Touch Here":this.state.fromStation} </Text>
              </TouchableOpacity>
            </View>
            <View style={{padding:40}}>
              <TouchableOpacity
                style={styles.button}
                onPress={()=>this.onPress('to')}
                name="to"
              >
                <Text> {this.state.fromStation==""?"Touch Here":this.state.toStation} </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <OverlayComponent
        modalVisible={this.state.modalVisible}
        modalData={this.state.modalData}
        modalClose={()=>this.setState((prevState)=>({modalVisible:!prevState.modalVisible}))}
        itemSelected={this.setStation}
        />
      </View>
    );
  }
}

class OverlayComponent extends React.Component {
  constructor(props)
  {
    super(props);
    this.state = {
      modalVisible : this.props.modalVisible
    }
    this.selectedItemReturn = this.selectedItemReturn.bind(this);
  }

selectedItemReturn(sid){
    this.props.modalClose();
    this.props.itemSelected(sid)
        console.log("Select "+sid);
  }

  render(){
    return (
      <Overlay isVisible={this.props.modalVisible}
      onBackdropPress={() => this.props.modalClose()}>
      <View style={{padding : 40}}>
      {    this.props.modalData.map((data,id)=>{
            return (
              <TouchableListItem key={id} sid={data.value} text={data.text} selectItem={this.selectedItemReturn}/>
            )
        })
      }
      </View>
      </Overlay>
    );
  }

}


class TouchableListItem extends React.Component {
  render(){
    return (
      <TouchableOpacity style={{backgroundColor:'green',padding:10}} onPress={()=>this.props.selectItem(this.props.sid)}>
        <Text>{this.props.text}</Text>
      </TouchableOpacity>
    );
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
