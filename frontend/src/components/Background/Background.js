import LinearGradient from 'react-native-linear-gradient';
import styled from 'styled-components/native';
import {appColors} from '../../utils/appColors';

export default styled(LinearGradient).attrs({
  colors: [appColors.fifth, appColors.black],
})`
  flex: 1;
`;
