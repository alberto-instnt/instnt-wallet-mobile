/* eslint-disable import/no-extraneous-dependencies */
import {
  animatedComponents,
  AnimatedComponentsProvider,
  AuthProvider,
  ContainerProvider,
  ErrorBoundaryWrapper,
  ErrorModal,
  initLanguages,
  initStoredLanguage,
  MainContainer,
  NavContainer,
  NetworkProvider,
  StoreProvider,
  ThemeProvider,
  toastConfig,
  TourProvider,
} from '@bifold/core'
import messaging from '@react-native-firebase/messaging'
import { useNavigationContainerRef } from '@react-navigation/native'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { isTablet } from 'react-native-device-info'
import Orientation from 'react-native-orientation-locker'
import SplashScreen from 'react-native-splash-screen'
import Toast from 'react-native-toast-message'
import { container } from 'tsyringe'

import Root from '@/Root'
import { BCThemeNames, surveyMonkeyExitUrl, surveyMonkeyUrl } from '@/constants'
import { localization } from '@/localization'
import { initialState, reducer } from '@/store'
import { themes } from '@/theme'
import BCLogger from '@/utils/logger'
import tours from '@bcwallet-theme/features/tours'
import WebDisplay from '@screens/WebDisplay'
import { AppContainer } from './container-imp'

initLanguages(localization)

// Do nothing with push notifications received while the app is in the background
messaging().setBackgroundMessageHandler(async () => {})

// Do nothing with push notifications received while the app is in the foreground
messaging().onMessage(async () => {})

// const codePushOptions = {
//   checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
//   installMode: codePush.InstallMode.IMMEDIATE,
//   updateDialog: {
//     appendReleaseDescription: true,
//     title: 'A new update is available!',
//   },
// }

const App = () => {
  const { t } = useTranslation()
  const navigationRef = useNavigationContainerRef()
  const bifoldContainer = new MainContainer(container.createChildContainer()).init()
  const [surveyVisible, setSurveyVisible] = useState(false)
  const bcwContainer = new AppContainer(bifoldContainer, t, navigationRef.navigate, setSurveyVisible).init()

  if (!isTablet()) {
    Orientation.lockToPortrait()
  }

  // const settings = [
  //   {
  //     header: {
  //       title: t('Settings.Help'),
  //       icon: { name: 'help' },
  //     },
  //     data: [
  //       {
  //         title: t('Settings.HelpUsingBCWallet'),
  //         accessibilityLabel: t('Settings.HelpUsingBCWallet'),
  //         testID: testIdWithKey('HelpUsingBCWallet'),
  //         onPress: () => Linking.openURL(helpLink),
  //       },
  //       // {
  //       //   title: t('Settings.GiveFeedback'),
  //       //   accessibilityLabel: t('Settings.GiveFeedback'),
  //       //   testID: testIdWithKey('GiveFeedback'),
  //       //   onPress: toggleSurveyVisibility,
  //       // },
  //       {
  //         title: t('Settings.ReportAProblem'),
  //         accessibilityLabel: t('Settings.ReportAProblem'),
  //         testID: testIdWithKey('ReportAProblem'),
  //         onPress: toggleSurveyVisibility,
  //       },
  //     ],
  //   },
  //   {
  //     header: {
  //       title: t('Settings.MoreInformation'),
  //       icon: { name: 'info' },
  //     },
  //     data: [
  //       {
  //         title: t('Settings.TermsOfUse'),
  //         accessibilityLabel: t('Settings.TermsOfUse'),
  //         testID: testIdWithKey('TermsOfUse'),
  //         onPress: () => navigate(Stacks.SettingStack as never, { screen: Screens.Terms } as never),
  //       },
  //       {
  //         title: t('Settings.IntroductionToTheApp'),
  //         accessibilityLabel: t('Settings.IntroductionToTheApp'),
  //         testID: testIdWithKey('IntroductionToTheApp'),
  //         onPress: () => navigate(Stacks.SettingStack as never, { screen: Screens.Onboarding } as never),
  //       },
  //       {
  //         title: t('Settings.PlayWithBCWallet'),
  //         accessibilityLabel: t('Settings.PlayWithBCWallet'),
  //         testID: testIdWithKey('PlayWithBCWallet'),
  //         onPress: () => Linking.openURL('https://digital.gov.bc.ca/digital-trust/showcase/'),
  //       },
  //     ],
  //   },
  // ]

  //configuration.settings = settings

  useEffect(() => {
    // Hide the native splash / loading screen so that our
    // RN version can be displayed.
    // codePush.sync({
    // installMode: codePush.InstallMode.IMMEDIATE,
    // })
    initStoredLanguage().then()
  }, [])

  useEffect(() => {
    // Hide the native splash / loading screen so
    // that our RN version can be displayed.
    SplashScreen.hide()
  }, [])

  return (
    <ErrorBoundaryWrapper logger={BCLogger}>
      <ContainerProvider value={bcwContainer}>
        <StoreProvider initialState={initialState} reducer={reducer}>
          <ThemeProvider themes={themes} defaultThemeName={BCThemeNames.BCWallet}>
            <NavContainer navigationRef={navigationRef}>
              <AnimatedComponentsProvider value={animatedComponents}>
                <AuthProvider>
                  <NetworkProvider>
                    <ErrorModal enableReport />
                    <WebDisplay
                      destinationUrl={surveyMonkeyUrl}
                      exitUrl={surveyMonkeyExitUrl}
                      visible={surveyVisible}
                      onClose={() => setSurveyVisible(false)}
                    />
                    <TourProvider tours={tours} overlayColor={'black'} overlayOpacity={0.7}>
                      <Root />
                    </TourProvider>
                    <Toast topOffset={15} config={toastConfig} />
                  </NetworkProvider>
                </AuthProvider>
              </AnimatedComponentsProvider>
            </NavContainer>
          </ThemeProvider>
        </StoreProvider>
      </ContainerProvider>
    </ErrorBoundaryWrapper>
  )
}

export default App
// export default codePush(codePushOptions)(App)
