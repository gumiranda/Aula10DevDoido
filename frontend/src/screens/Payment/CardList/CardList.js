import React, {useEffect, useState, useMemo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {ActivityIndicator} from 'react-native';
import {format, isPast} from 'date-fns';
import pt from 'date-fns/locale/pt';
import {Title, SubmitButton} from './styles';
import Background from '../../../components/Background/Background';
import CreditCardList from '../../../components/CreditCardList/CreditCardList';
import appMetrics from '../../../utils/appMetrics';
import {appColors} from '../../../utils/appColors';
import {getRequest} from '../../../appStore/appModules/creditcard/list';

const ratio = 228 / 362;
export const CARD_WIDTH = appMetrics.DEVICE_WIDTH * 0.8;
export const CARD_HEIGHT = CARD_WIDTH * ratio;
export default function CardList({navigation}) {
  const dispatch = useDispatch();
  const cards = useSelector(state => state.creditcard.cards);
  const profile = useSelector(state => state.user.profile);
  const expirate = useMemo(() => {
    return isPast(new Date(profile.payDay).getTime());
  });
  const dateFormatted = useMemo(() => {
    return format(
      new Date(new Date(profile.payDay)).getTime(),
      "dd 'de' MMMM 'de' yyyy",
      {
        locale: pt,
      },
    );
  }, [profile.payDay]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    dispatch(getRequest());
  }, [dispatch]);
  useEffect(() => {
    if (navigation.getParam('goToHome')) {
      navigation.navigate('Home');
    } else if (cards.length > 0) {
      setLoading(false);
    } else if (profile.cpf && profile.phone) {
      navigation.navigate('Plans');
      setLoading(false);
    } else {
      navigation.navigate('CompleteRegister');
      setLoading(false);
    }
  }, [profile.cpf, profile.phone, navigation, cards.length]);
  const addCard = () => {
    if (profile.cpf && profile.phone) {
      navigation.push('Plans', {checkEasy: false});
    } else {
      navigation.navigate('CompleteRegister');
    }
  };
  const onPress = (_id, brand, cardNumber, name) => {
    if (new Date(profile.payDay).getTime() < new Date().getTime()) {
      navigation.push('Plans', {
        checkEasy: true,
        card_id: _id,
        brand,
        cardNumber,
        name,
      });
      // navigation.push('CheckoutEasy', {card_id: _id, brand, cardNumber, name});
    }
  };
  return (
    <Background>
      <Title>Pagamento</Title>
      {loading ? (
        <ActivityIndicator size="large" color={appColors.white} />
      ) : null}
      {new Date(profile.payDay).getTime() < new Date().getTime() ? (
        <SubmitButton
          textColor={appColors.white}
          color={appColors.fifth}
          onPress={() => addCard()}>
          {cards && cards.length === 0
            ? 'Selecionar plano de assinatura'
            : 'Mudar de plano'}
        </SubmitButton>
      ) : null}

      <CreditCardList onPress={onPress} cards={cards} />
      {expirate ? (
        <Title style={{marginHorizontal: 20, fontSize: 12}}>
          Sua assinatura expirou {dateFormatted}
        </Title>
      ) : (
        <Title style={{marginHorizontal: 20, fontSize: 12}}>
          Assinatura válida até {dateFormatted}
        </Title>
      )}
    </Background>
  );
}
