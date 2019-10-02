import React, { Component } from 'react';
import { View, Button, Text, ActivityIndicator } from 'react-native';
import firebase from 'firebase';
import Input from './Input';

// Define variables to update in order to reference and display in GUI
export default class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = { email: '', password: '', error: '' };
  }

  onButtonPress() {
    this.setState({ error: '', loading: true })
    const { email, password } = this.state;
    // Submit login information to the Firebase database in compare to server
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(this.onLoginSuccess.bind(this))
      .catch(() => {
        firebase.auth().createUserWithEmailAndPassword(email, password)
          .then(this.onLoginSuccess.bind(this))
          // If there is an error print error message
          .catch((error) => {
            let errorCode = error.code
            let errorMessage = error.message;
            if (errorCode == 'auth/weak-password') {
              this.onLoginFailure.bind(this)('Weak password!')
            } else {
              this.onLoginFailure.bind(this)(errorMessage)
            }
          });
      });
  }

  // Update variable to move us to the home screen
  onLoginSuccess() {
    this.setState({
      email: '', password: '', error: '', loading: false
    })
  }

  // Stop loading screen and print error
  onLoginFailure(errorMessage) {
    this.setState({ error: errorMessage, loading: false })
  }

  // Display button and search for presses
  renderButton() {
    if (this.state.loading) {
      return (
        <View style={styles.spinnerStyle}>
          <ActivityIndicator size={"small"} />
        </View>
      )
    } else {
      return (
        <Button
          title="Sign in / Create Account"
          onPress={this.onButtonPress.bind(this)}
        />
      )
    }
  }

  render() {
    return (
      <View>
        <Input label="Email"
          placeholder="user@mail.com"
          value={this.state.email}
          secureTextEntry={false}
          onChangeText={email => this.setState({ email })} />

        <Input label="Password"
          placeholder="password"
          value={this.state.password}
          secureTextEntry={true}
          onChangeText={password => this.setState({ password })} />

        {this.renderButton()}
        
        <Text style={styles.errorTextStyle}>
          {this.state.error}
        </Text>
      </View>
    )
  }
}

const styles = {
  errorTextStyle: {
    fontSize: 16,
    alignSelf: 'center',
    color: 'red'
  },
  spinnerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
}