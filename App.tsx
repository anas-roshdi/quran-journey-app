import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts, Tajawal_400Regular, Tajawal_500Medium, Tajawal_700Bold } from '@expo-google-fonts/tajawal';

// Auth Screens
import LoginScreen from './src/screens/auth/LoginScreen';

// Shared Screens
import ProfileScreen from './src/screens/shared/ProfileScreen';
import LeaderboardScreen from './src/screens/shared/LeaderboardScreen';
import MemorizationPlanScreen from './src/screens/shared/MemorizationPlanScreen';
import LearnTajweedScreen from './src/screens/shared/LearnTajweedScreen';
import NotificationsScreen from './src/screens/shared/NotificationsScreen';
import EditProfileScreen from './src/screens/shared/EditProfileScreen';
import ChangePasswordScreen from './src/screens/shared/ChangePasswordScreen';

// Student Screens
import DashboardScreen from './src/screens/student/StudentDashboardScreen';
import QuranReaderScreen from './src/screens/student/QuranReaderScreen';
import MyClassesScreen from './src/screens/student/StudentClassesScreen';
import TestsScreen from './src/screens/student/TestsScreen';
import ChallengesScreen from './src/screens/student/ChallengesScreen';
import JoinClassScreen from './src/screens/student/JoinClassScreen';
import AchievementsScreen from './src/screens/student/AchievementsScreen';
import BookTestScreen from './src/screens/student/BookTestScreen';

// Teacher Screens
import TeacherDashboardScreen from './src/screens/teacher/TeacherDashboardScreen';
import TeacherClassesScreen from './src/screens/teacher/TeacherClassesScreen';
import JoinRequestsScreen from './src/screens/teacher/JoinRequestsScreen';
import TeacherTestsScreen from './src/screens/teacher/TeacherTestsScreen';
import CreateTestSessionScreen from './src/screens/teacher/CreateTestSessionScreen';


// Parent Screens
import ParentDashboardScreen from './src/screens/parent/ParentDashboardScreen';
import MyChildrenScreen from './src/screens/parent/MyChildrenScreen';
import ParentReportsScreen from './src/screens/parent/ParentReportsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  let [fontsLoaded] = useFonts({
    'Tajawal-Regular': Tajawal_400Regular,
    'Tajawal-Medium': Tajawal_500Medium,
    'Tajawal-Bold': Tajawal_700Bold,
  });

  if (!fontsLoaded) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="QuranReader" component={QuranReaderScreen} />
        <Stack.Screen name="TeacherDashboard" component={TeacherDashboardScreen} />
        <Stack.Screen name="ParentDashboard" component={ParentDashboardScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="MyClasses" component={MyClassesScreen} />
        <Stack.Screen name="TeacherClasses" component={TeacherClassesScreen} />
        <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
        <Stack.Screen name="JoinRequests" component={JoinRequestsScreen} />
        <Stack.Screen name="MyChildren" component={MyChildrenScreen} />
        <Stack.Screen name="ParentReports" component={ParentReportsScreen} />
        <Stack.Screen name="MemorizationPlan" component={MemorizationPlanScreen} />
        <Stack.Screen name="LearnTajweed" component={LearnTajweedScreen} />
        <Stack.Screen name="Tests" component={TestsScreen} />
        <Stack.Screen name="Challenges" component={ChallengesScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="JoinClass" component={JoinClassScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
        <Stack.Screen name="Achievements" component={AchievementsScreen} />
        <Stack.Screen name="BookTest" component={BookTestScreen} />
        <Stack.Screen name="TeacherTests" component={TeacherTestsScreen} />
        <Stack.Screen name="CreateTestSession" component={CreateTestSessionScreen} />




      </Stack.Navigator>
    </NavigationContainer>
  );
}