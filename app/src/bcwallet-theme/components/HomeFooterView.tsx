import { Button, ButtonType, testIdWithKey, useTheme } from '@bifold/core'
import React, { PropsWithChildren, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, Text, Image } from 'react-native'

import { surveyMonkeyUrl, surveyMonkeyExitUrl } from '@/constants'
import WebDisplay from '@screens/WebDisplay'
import { useNotifications } from '@/hooks/notifications'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

interface HomeFooterViewProps {
  children?: React.ReactNode
}

const offset = 25

const HomeFooterView = ({ children }: HomeFooterViewProps) => {
  const { ColorPalette } = useTheme()
  const notifications = useNotifications()
  const { t } = useTranslation()
  const styles = StyleSheet.create({
    feedbackContainer: {
      marginTop: 10,
      paddingHorizontal: 20,
      paddingVertical: 20,
      backgroundColor: ColorPalette.brand.secondaryBackground,
    },

    messageContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 35,
      marginHorizontal: offset,
    },

    feedbackIcon: {
      marginRight: 8,
    },
  })

  const displayMessage = (credentialCount: number) => {
    if (typeof credentialCount === 'undefined' && credentialCount >= 0) {
      throw new Error('Credential count cannot be undefined')
    }

    let credentialMsg

    if (credentialCount === 1) {
      credentialMsg = (
        <Text>
          {t('Home.YouHave')} <Text style={{ fontWeight: ColorPalette.bold.fontWeight }}>{credentialCount}</Text>{' '}
          {t('Home.Credential')} {t('Home.InYourWallet')}
        </Text>
      )
    } else if (credentialCount > 1) {
      credentialMsg = (
        <Text>
          {t('Home.YouHave')} <Text style={{ fontWeight: ColorPalette.bold.fontWeight }}>{credentialCount}</Text>{' '}
          {t('Home.Credentials')} {t('Home.InYourWallet')}
        </Text>
      )
    } else {
      credentialMsg = t('Home.NoCredentials')
    }

    return (
      <>
        {notifications?.length === 0 && (
          <View style={[styles.messageContainer]}>
            <Text adjustsFontSizeToFit style={[ColorPalette.welcomeHeader, { marginTop: offset, marginBottom: 20 }]}>
              {t('Home.Welcome')}
            </Text>
            <Image source={ColorPalette.img.logoPrimary.src} style={{ width: 90, height: 125 }} />
          </View>
        )}
        <View style={[styles.messageContainer]}>
          <Text style={[ColorPalette.credentialMsg, { marginTop: offset, textAlign: 'center' }]}>{credentialMsg}</Text>
        </View>
      </>
    )
  }

  return (
    <View style={styles.feedbackContainer}>
      <Button
        title={t('Feedback.GiveFeedback')}
        accessibilityLabel={t('Feedback.GiveFeedback')}
        testID={testIdWithKey('GiveFeedback')}
        onPress={()=>{}}
        buttonType={ButtonType.Secondary}
      >
        <Icon
          name="message-draw"
          style={[styles?.feedbackIcon, { color: ColorPalette.brand.primary }]}
          size={26}
          color={ColorPalette.grayscale.white}
        />
      </Button>
      <WebDisplay
        destinationUrl={surveyMonkeyUrl}
        exitUrl={surveyMonkeyExitUrl}
        visible={true}
        onClose={()=>{}}
      />
      {children}
    </View>
  )
}

export default HomeFooterView
