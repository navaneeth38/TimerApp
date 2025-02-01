import { useEffect, useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';

const CongratsModal = ({  showModal, setShowModal, updateHistory }) =>{


return (
  <Modal visible={showModal} onRequestClose={()=> setShowModal(false)} transparent>
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ padding: 20, backgroundColor: 'white', borderRadius: 10 }}>
        <Text>Congratulations! You completed the timer</Text>
        <Pressable onPress={() => setShowModal(false)}>
        <View style={{ width: '20%', padding: 10, borderColor: 'lightGray', borderWidth: 1, borderRadius: 5, marginTop: 10, alignItems: 'center'}}>
         <Text>OK</Text>
        </View>
        </Pressable>
      </View>
    </View>
  </Modal>
);
}
export default CongratsModal
