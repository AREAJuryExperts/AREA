import React from 'react';
import renderer from 'react-test-renderer';
import LoginPage from '../../src/LoginPage/LoginPage.js';
import App from '../../App.js';
import {fireEvent, cleanup, render, screen, act} from '@testing-library/react-native';

afterEach(cleanup);

let registerInfo = '';
const setRegisterInfo = (info) => {
}

describe('<Login />', () => {
  it('renders correctly', async () => {
    const tree = renderer.create(<LoginPage registerInfo={registerInfo} setRegisterInfo={setRegisterInfo}/>).toJSON();
    expect(tree).toMatchSnapshot();
    return
  });
  it('can fill prompts and click buttons', async () => {
    const {getByTestId} = render(<LoginPage registerInfo={registerInfo} setRegisterInfo={setRegisterInfo}/>);
    const {getByText} = screen;
    const foundButton = getByTestId("loginBtn");
    const foundPasswordInput = getByTestId("passwordInput");
    const userNameInput = getByTestId("userNameInput");
    fireEvent.changeText(userNameInput, 'robin.denni@epitech.eu');
    fireEvent.changeText(foundPasswordInput, 'C00lPassword');
    fireEvent.press(foundButton);
    expect(getByText('Login')).toBeTruthy();
    return
  });
  it('can go to the register page', async () => {
    const {getByTestId} = render(<App />);
    const {getByText} = screen;
    act(() => {
      const foundButton = getByTestId("registerBtn");
      fireEvent.press(foundButton);
    })
    expect(getByText('Password confirmation')).toBeTruthy();
    return;
  })
});