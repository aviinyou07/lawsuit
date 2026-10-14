import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TextInput,
  ScrollView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { apiClient } from '../../api/client';

type Props = NativeStackScreenProps<RootStackParamList, 'ConsultationRoom'>;

export const ConsultationRoomScreen: React.FC<Props> = ({ navigation, route }) => {
  const { appointment_id } = route.params;
  const [roomData, setRoomData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messagesList, setMessagesList] = useState<string[]>([
    'Counsel has joined the secure room.',
    'All communications are encrypted and confidential.',
  ]);

  useEffect(() => {
    joinRoom();

    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [appointment_id]);

  const joinRoom = async () => {
    try {
      setLoading(true);
      const res = await apiClient.post(`/consultations/${appointment_id}/join`);
      if (res.data.success) {
        setRoomData(res.data.data);
      }
    } catch (err: any) {
      Alert.alert('Connection Error', err.response?.data?.message || 'Failed to enter consultation room');
    } finally {
      setLoading(false);
    }
  };

  const handleEndCall = () => {
    Alert.alert('End Consultation', 'Are you sure you want to conclude this legal consultation?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'End Call',
        style: 'destructive',
        onPress: async () => {
          try {
            await apiClient.post(`/consultations/${appointment_id}/complete`, {
              actual_duration_seconds: elapsedSeconds,
            });
            navigation.replace('Review', {
              appointment_id,
              lawyer_name: 'Advocate',
            });
          } catch (err) {
            navigation.goBack();
          }
        },
      },
    ]);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessagesList((prev) => [...prev, `You: ${message.trim()}`]);
      setMessage('');
    }
  };

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.secondary} />
        <Text style={styles.connectingText}>Establishing Encrypted Agora RTC Stream...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Top Header Bar */}
      <View style={styles.topBar}>
        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE • {formatTimer(elapsedSeconds)}</Text>
        </View>
        <Text style={styles.channelText}>Room #{roomData?.agora_channel_name?.slice(-6) || '2026'}</Text>
      </View>

      {/* Main Video Stream Stage */}
      <View style={styles.videoStage}>
        {isCameraOff ? (
          <View style={styles.cameraOffPlaceholder}>
            <Text style={styles.placeholderIcon}>👤</Text>
            <Text style={styles.placeholderName}>Advocate Stream Active</Text>
            <Text style={styles.placeholderSub}>Encrypted Audio-Visual Link Established</Text>
          </View>
        ) : (
          <View style={styles.remoteVideoMock}>
            <Text style={styles.remoteVideoText}>⚖️ Encrypted High-Definition Video Stream</Text>
            <View style={styles.pipView}>
              <Text style={styles.pipText}>You</Text>
            </View>
          </View>
        )}
      </View>

      {/* In-Call Chat Drawer (Toggleable) */}
      {chatOpen && (
        <View style={styles.chatDrawer}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatTitle}>In-Call Secure Chat</Text>
            <TouchableOpacity onPress={() => setChatOpen(false)}>
              <Text style={styles.closeChatText}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.chatMessages}>
            {messagesList.map((msg, i) => (
              <View key={i} style={styles.chatBubble}>
                <Text style={styles.chatBubbleText}>{msg}</Text>
              </View>
            ))}
          </ScrollView>
          <View style={styles.chatInputRow}>
            <TextInput
              style={styles.chatInput}
              placeholder="Send reference or query..."
              placeholderTextColor={colors.textLight}
              value={message}
              onChangeText={setMessage}
            />
            <TouchableOpacity style={styles.sendBtn} onPress={handleSendMessage}>
              <Text style={styles.sendBtnText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Bottom Floating Control Bar */}
      <View style={styles.controlsBar}>
        <TouchableOpacity
          style={[styles.controlBtn, isMuted && styles.controlBtnActive]}
          onPress={() => setIsMuted(!isMuted)}
        >
          <Text style={styles.controlIcon}>{isMuted ? '🔇' : '🎙️'}</Text>
          <Text style={styles.controlLabel}>{isMuted ? 'Unmute' : 'Mute'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlBtn, isCameraOff && styles.controlBtnActive]}
          onPress={() => setIsCameraOff(!isCameraOff)}
        >
          <Text style={styles.controlIcon}>{isCameraOff ? '🚫' : '📹'}</Text>
          <Text style={styles.controlLabel}>{isCameraOff ? 'Camera On' : 'Camera Off'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlBtn}
          onPress={() => setChatOpen(!chatOpen)}
        >
          <Text style={styles.controlIcon}>💬</Text>
          <Text style={styles.controlLabel}>Notes/Chat</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.endCallBtn} onPress={handleEndCall}>
          <Text style={styles.endCallIcon}>📞</Text>
          <Text style={styles.endCallLabel}>End Call</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  centerContainer: {
    flex: 1,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  connectingText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 54,
    paddingHorizontal: 20,
    zIndex: 10,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.danger,
  },
  liveText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  channelText: {
    color: colors.textLight,
    fontSize: 12,
    fontWeight: '600',
  },
  videoStage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  remoteVideoMock: {
    width: '92%',
    height: '75%',
    backgroundColor: '#1E293B',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  remoteVideoText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  pipView: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 90,
    height: 120,
    backgroundColor: '#0F172A',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pipText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  cameraOffPlaceholder: {
    alignItems: 'center',
    gap: 8,
  },
  placeholderIcon: {
    fontSize: 64,
  },
  placeholderName: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
  placeholderSub: {
    color: colors.textLight,
    fontSize: 13,
  },
  chatDrawer: {
    position: 'absolute',
    bottom: 110,
    left: 20,
    right: 20,
    height: 240,
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
    padding: 14,
    zIndex: 20,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  chatTitle: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  closeChatText: {
    color: colors.textLight,
    fontSize: 16,
    fontWeight: '700',
  },
  chatMessages: {
    flex: 1,
    marginBottom: 8,
  },
  chatBubble: {
    backgroundColor: '#1E293B',
    borderRadius: 10,
    padding: 8,
    marginBottom: 6,
  },
  chatBubbleText: {
    color: colors.white,
    fontSize: 12,
  },
  chatInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  chatInput: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: colors.white,
    fontSize: 13,
  },
  sendBtn: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
  sendBtnText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  controlsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderTopWidth: 1,
    borderColor: '#1E293B',
  },
  controlBtn: {
    alignItems: 'center',
    gap: 4,
  },
  controlBtnActive: {
    opacity: 0.6,
  },
  controlIcon: {
    fontSize: 24,
  },
  controlLabel: {
    color: colors.textLight,
    fontSize: 11,
    fontWeight: '600',
  },
  endCallBtn: {
    backgroundColor: colors.danger,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 10,
    alignItems: 'center',
    gap: 2,
  },
  endCallIcon: {
    fontSize: 20,
  },
  endCallLabel: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '700',
  },
});
