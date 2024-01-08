import React from 'react';
import renderer from 'react-test-renderer';
import LoginPage from '../../src/LoginPage/LoginPage.js';
import {fireEvent, cleanup, render, screen} from '@testing-library/react-native';

afterEach(cleanup);


describe('<Login />', () => {
  it('renders correctly', async () => {
    let registerInfo = '';
    const setRegisterInfo = (info) => {
    }
    const tree = renderer.create(<LoginPage registerInfo={registerInfo} setRegisterInfo={setRegisterInfo}/>).toJSON();
    expect(tree).toMatchSnapshot();
    return
  });
  it('can fill prompts and click buttons', async () => {
        // const {getByTestId} = render(<Morpion isDayMode={true}/>);
        // const {getByText} = screen;
        // const foundButton = getByTestId("button00");
        // fireEvent.press(foundButton);
        // expect(getByText('X')).toBeTruthy();
        // return
    let registerInfo = '';
    const setRegisterInfo = (info) => {
    }
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
});