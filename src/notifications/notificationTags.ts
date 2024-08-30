import { OneSignal } from "react-native-onesignal";

export function tagUserSignIn(username: string) {
    OneSignal.User.addTag("username", username);
}

export function tagUserSignOut(){
    OneSignal.User.removeTag("username");
}

export function tagExerciseComplete() {
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    OneSignal.User.addTag("last_exercise_date", today.toLocaleDateString());
}

export function tagExerciseIncomplete(date: string){
    OneSignal.User.addTag("last_exercise_date", date);
}