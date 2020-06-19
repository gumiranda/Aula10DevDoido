import styled from 'styled-components/native';
import {appColors} from '../../../utils/appColors';
import ShadowButton from '../../../components/ShadowButton/ShadowButton';
import Button from '../../../components/Button/Button';

export const Title = styled.Text`
  font-size: 20px;
  color: ${appColors.white};
  font-weight: bold;
  align-self: center;
  margin-vertical: 15px;
  margin-horizontal: 10px;
`;
export const SubmitButton = styled(ShadowButton)`
  margin-horizontal: 35px;
  border-radius: 4px;
`;
