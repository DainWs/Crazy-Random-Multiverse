import { ref } from 'vue'
import settingsService from '@/services/settings/SettingsService'
import StompDestinations from '@/services/stomp/StompDestinations'
import stompService from '@/services/stomp/StompService'

const username = ref('');

settingsService.getUsername()
  .then(value => username.value = value)

const getUsername = () => {
    return username;
}

const changeUsername = async (event) => {
    let newUsername = event.target.value
    if (newUsername != undefined) {
        username.value = newUsername
    }
}

const persistUsername = async () => {
    settingsService.setUsername(username.value)
    await stompService.send(StompDestinations.USER_UPDATE, {username: username.value})
}

export default {
    getUsername,
    changeUsername,
    persistUsername
}