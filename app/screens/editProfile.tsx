import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { useAuth } from '../context/AuthContext';
import { updateProfile, uploadImage } from '../lib/services/userService';

const DEFAULT_PROFILE_PIC = 'https://i.imgur.com/6XbK6bE.jpg';
const DEFAULT_COVER_PHOTO = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb';

export default function EditProfile() {
  const router = useRouter();
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    profilePicture: user?.profilePicture ?? DEFAULT_PROFILE_PIC,
    avatar: user?.details?.avatar ?? DEFAULT_PROFILE_PIC,
    coverPhoto: user?.coverPhoto ?? DEFAULT_COVER_PHOTO,
    bio: user?.bio ?? "",
    details: {
      profileType: user?.details?.profileType ?? "Just for fun",
      worksAt1: user?.details?.worksAt1 ?? "",
      worksAt2: user?.details?.worksAt2 ?? "",
      studiedAt: user?.details?.studiedAt ?? "",
      wentTo: user?.details?.wentTo ?? "",
      currentCity: user?.details?.currentCity ?? "",
      hometown: user?.details?.hometown ?? "",
      relationshipStatus: user?.details?.relationshipStatus ?? "",
      showAvatar: user?.details?.showAvatar ?? false
    }
  });
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardVisible(false)
    );
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Please sign in to edit profile</Text>
      </View>
    );
  }

  const pickImage = async (field: 'profilePicture' | 'avatar' | 'coverPhoto') => {
    try {
      setLoading(true);
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: field === 'coverPhoto' ? [3, 1] : [1, 1],
        quality: 1,
      });

      if (!result.canceled && user?.id && updateUser) {
        const uploadType = field;
        const manipResult = await ImageManipulator.manipulateAsync(
          result.assets[0].uri,
          [{ resize: { width: 800 } }],
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
        );
        let imageUrl = await uploadImage(manipResult.uri, uploadType, user.id);
        // Ensure absolute URL
        if (imageUrl && !imageUrl.startsWith('http')) {
          imageUrl = `http://10.132.74.85:8080${imageUrl}`;
        }

        if (field === 'avatar') {
          await updateProfile(user.id, {
            details: {
              avatar: imageUrl,
              showAvatar: profileData.details.showAvatar
            }
          });
          setProfileData(prev => ({
            ...prev,
            avatar: imageUrl
          }));
        } else {
          await updateProfile(user.id, { [field]: imageUrl });
          setProfileData(prev => ({
            ...prev,
            [field]: imageUrl
          }));
        }
        await updateUser();
      }
    } catch (error) {
      console.error('Error updating image:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const updatedUser = await updateProfile(user.id, profileData);
      updateUser(updatedUser);
      router.back();
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (field: string, currentValue: string) => {
    setEditingField(field);
    setTempValue(currentValue);
  };

  const saveEdit = () => {
    if (!editingField) return;
    if (editingField.includes('.')) {
      const [parent, child] = editingField.split('.');
      setProfileData(prev => ({
        ...prev,
        [parent]: {
          ...prev.details,
          [child]: tempValue
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [editingField]: tempValue
      }));
    }
    setEditingField(null);
    Keyboard.dismiss();
  };

  const cancelEdit = () => {
    setEditingField(null);
    Keyboard.dismiss();
  };

  function renderDetailRow(field: string, icon: React.ReactNode, text: string, placeholder?: boolean) {
    const isEditing = editingField === field;
    const currentValue = field.includes('.')
      ? profileData.details[field.split('.')[1] as keyof typeof profileData.details]
      : profileData[field as keyof typeof profileData];

    return (
      <View style={styles.detailRow}>
        {icon}
        {isEditing ? (
          <View style={styles.editContainer}>
            <TextInput
              style={[styles.detailText, styles.textInput]}
              value={tempValue}
              onChangeText={setTempValue}
              autoFocus
            />
            <View style={styles.editActions}>
              <TouchableOpacity onPress={cancelEdit}>
                <Text style={styles.cancelButton}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={saveEdit}>
                <Text style={styles.saveButton}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.detailTextContainer}>
            <Text style={[styles.detailText, placeholder && styles.placeholderText]}>
              {text}
            </Text>
            <TouchableOpacity
              style={styles.editIcon}
              onPress={() => startEditing(field, currentValue as string)}
            >
              <Ionicons name="create-outline" size={16} color="#1877f2" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={keyboardVisible ? styles.scrollViewContentKeyboardOpen : styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={26} color="#222" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <TouchableOpacity onPress={handleSave} disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color="#1877f2" />
            ) : (
              <Text style={styles.saveButton}>Save</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Profile Picture */}
        <Text style={styles.sectionTitle}>
          Profile picture
          <TouchableOpacity onPress={() => pickImage('profilePicture')}>
            <Text style={styles.editLink}> Edit</Text>
          </TouchableOpacity>
        </Text>
        <Image
          source={{ uri: profileData.profilePicture }}
          style={styles.profilePic}
        />

        {/* Avatar */}
        <Text style={styles.sectionTitle}>
          Avatar
          <TouchableOpacity onPress={() => pickImage('avatar')}>
            <Text style={styles.editLink}> Edit</Text>
          </TouchableOpacity>
        </Text>
        <Image
          source={{ uri: profileData.avatar }}
          style={styles.avatarImg}
        />
        <View style={styles.avatarRow}>
          <Text style={styles.avatarLabel}>
            Show on profile <Ionicons name="information-circle-outline" size={14} color="#888" />
          </Text>
          <Switch
            value={profileData.details.showAvatar}
            onValueChange={val =>
              setProfileData(prev => ({
                ...prev,
                details: { ...prev.details, showAvatar: val }
              }))
            }
            thumbColor={profileData.details.showAvatar ? "#1877f2" : "#ccc"}
          />
        </View>
        <Text style={styles.avatarInfo}>
          Your animated avatar is displayed when you swipe your profile picture.
        </Text>

        {/* Cover Photo */}
        <Text style={styles.sectionTitle}>
          Cover photo
          <TouchableOpacity onPress={() => pickImage('coverPhoto')}>
            <Text style={styles.editLink}> Edit</Text>
          </TouchableOpacity>
        </Text>
        <Image
          source={{ uri: profileData.coverPhoto }}
          style={styles.coverPhoto}
        />

        {/* Bio */}
        <View style={styles.rowBetween}>
          <Text style={styles.sectionTitle}>Bio</Text>
          {editingField === 'bio' ? (
            <View style={styles.editActions}>
              <TouchableOpacity onPress={cancelEdit}>
                <Text style={styles.cancelButton}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={saveEdit}>
                <Text style={styles.saveButton}>Save</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={() => startEditing('bio', profileData.bio)}>
              <Text style={styles.editLink}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>
        {editingField === 'bio' ? (
          <TextInput
            style={styles.textInput}
            value={tempValue}
            onChangeText={setTempValue}
            multiline
            autoFocus
          />
        ) : (
          <Text style={styles.bioText}>{profileData.bio}</Text>
        )}

        {/* Details */}
        <View style={styles.rowBetween}>
          <Text style={styles.sectionTitle}>Details</Text>
          <View style={{ width: 60 }} />
        </View>

        {renderDetailRow(
          'details.profileType',
          <Ionicons name="information-circle-outline" size={18} color="#222" />,
          `Profile · ${profileData.details.profileType}`
        )}

        {renderDetailRow(
          'details.worksAt1',
          <MaterialIcons name="work-outline" size={18} color="#222" />,
          `Works at ${profileData.details.worksAt1}`
        )}

        {renderDetailRow(
          'details.worksAt2',
          <MaterialIcons name="work-outline" size={18} color="#222" />,
          `Works at ${profileData.details.worksAt2}`
        )}

        {renderDetailRow(
          'details.studiedAt',
          <FontAwesome5 name="university" size={16} color="#222" />,
          `Studied at ${profileData.details.studiedAt}`
        )}

        {renderDetailRow(
          'details.wentTo',
          <FontAwesome5 name="school" size={16} color="#222" />,
          `Went to ${profileData.details.wentTo}`
        )}

        {renderDetailRow(
          'details.currentCity',
          <Ionicons name="home-outline" size={18} color="#222" />,
          profileData.details.currentCity || "Current City",
          true
        )}

        {renderDetailRow(
          'details.hometown',
          <Ionicons name="location-outline" size={18} color="#222" />,
          profileData.details.hometown || "Hometown",
          true
        )}

        {renderDetailRow(
          'details.relationshipStatus',
          <Ionicons name="heart-outline" size={18} color="#222" />,
          profileData.details.relationshipStatus || "Relationship Status",
          true
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollViewContent: {
    paddingBottom: 20
  },
  scrollViewContentKeyboardOpen: {
    paddingBottom: 300
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 48,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f2f5",
    backgroundColor: "#fff",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 17,
    marginTop: 22,
    marginBottom: 8,
    color: "#222",
    paddingHorizontal: 16,
  },
  editLink: {
    color: "#1877f2",
    fontWeight: "bold",
    fontSize: 15,
    marginLeft: 8,
  },
  profilePic: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignSelf: "center",
    marginBottom: 18,
  },
  avatarImg: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignSelf: "center",
    marginBottom: 8,
  },
  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 2,
  },
  avatarLabel: {
    fontSize: 14,
    color: "#222",
    fontWeight: "500",
  },
  avatarInfo: {
    fontSize: 12,
    color: "#888",
    marginLeft: 16,
    marginBottom: 12,
  },
  coverPhoto: {
    width: "92%",
    height: 120,
    borderRadius: 12,
    alignSelf: "center",
    marginBottom: 18,
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 16,
  },
  bioText: {
    fontSize: 15,
    color: "#222",
    marginLeft: 16,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 16,
    marginBottom: 8,
    paddingRight: 16,
  },
  detailTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  detailText: {
    marginLeft: 10,
    fontSize: 15,
    color: "#222",
    flex: 1,
  },
  placeholderText: {
    color: "#222",
  },
  editIcon: {
    marginLeft: 10,
  },
  editContainer: {
    flex: 1,
    marginLeft: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  saveButton: {
    color: "#1877f2",
    fontWeight: "bold",
    marginLeft: 16,
  },
  cancelButton: {
    color: "#888",
  },
});