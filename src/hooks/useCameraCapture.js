import { useCallback, useEffect, useRef, useState } from 'react';

const CAPTURE_MAX_WIDTH = 640;
const CAPTURE_JPEG_QUALITY = 0.6;

function getFriendlyCameraError(err) {
  switch (err?.name) {
    case 'NotAllowedError':
    case 'PermissionDeniedError':
      return 'Bạn đã từ chối quyền truy cập camera. Vui lòng cấp quyền camera cho trình duyệt rồi thử lại.';
    case 'NotFoundError':
    case 'DevicesNotFoundError':
      return 'Không tìm thấy camera trên thiết bị này.';
    case 'NotReadableError':
    case 'TrackStartError':
      return 'Camera đang được ứng dụng khác sử dụng. Vui lòng đóng ứng dụng đó rồi thử lại.';
    default:
      return 'Không thể mở camera. Vui lòng kiểm tra thiết bị và thử lại.';
  }
}

// status: 'idle' | 'starting' | 'streaming' | 'error'
export function useCameraCapture() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setStatus('idle');
  }, []);

  const startCamera = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setError('Trình duyệt không hỗ trợ camera, hoặc trang không chạy trên HTTPS/localhost.');
      setStatus('error');
      return;
    }

    setStatus('starting');
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setStatus('streaming');
    } catch (err) {
      setError(getFriendlyCameraError(err));
      setStatus('error');
    }
  }, []);

  const capture = useCallback(() => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return null;

    const scale = Math.min(1, CAPTURE_MAX_WIDTH / video.videoWidth);
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(video.videoWidth * scale);
    canvas.height = Math.round(video.videoHeight * scale);

    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', CAPTURE_JPEG_QUALITY);
  }, []);

  // Đảm bảo camera luôn được tắt khi rời form/trang, tránh đèn webcam sáng nhầm.
  useEffect(() => stopCamera, [stopCamera]);

  return { videoRef, status, error, startCamera, stopCamera, capture };
}
