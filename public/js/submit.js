// public/js/submit.js – Report submission form interactions

(function () {
  // Character counters
  function bindCounter(inputId, counterId, max) {
    const input = document.getElementById(inputId);
    const counter = document.getElementById(counterId);
    if (!input || !counter) return;
    const update = () => {
      const len = input.value.length;
      counter.textContent = `${len}/${max}`;
      counter.style.color = len > max * 0.9 ? '#ef4444' : '#64748b';
    };
    input.addEventListener('input', update);
    update();
  }
  bindCounter('title', 'titleCount', 200);
  bindCounter('description', 'descCount', 5000);

  // File upload drag & drop
  const uploadArea = document.getElementById('uploadArea');
  const fileInput = document.getElementById('evidence');
  const fileList = document.getElementById('fileList');

  if (uploadArea && fileInput) {
    uploadArea.addEventListener('dragover', e => {
      e.preventDefault();
      uploadArea.classList.add('drag-over');
    });
    uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('drag-over'));
    uploadArea.addEventListener('drop', e => {
      e.preventDefault();
      uploadArea.classList.remove('drag-over');
      fileInput.files = e.dataTransfer.files;
      renderFileList();
    });
    fileInput.addEventListener('change', renderFileList);
  }

  function renderFileList() {
    if (!fileList) return;
    fileList.innerHTML = '';
    const files = fileInput.files;
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      const div = document.createElement('div');
      div.className = 'file-item';
      div.innerHTML = `<i class="fas fa-file"></i><span>${f.name}</span><span style="margin-left:auto;font-size:11px;color:#64748b">${(f.size / 1024).toFixed(1)}KB</span>`;
      fileList.appendChild(div);
    }
  }

  // Form submission with loading state
  const form = document.getElementById('reportForm');
  const submitBtn = document.getElementById('submitBtn');
  if (form && submitBtn) {
    form.addEventListener('submit', () => {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Encrypting & Submitting...';
    });
  }

  // ACK number input formatting
  const ackInput = document.getElementById('ackNumber');
  if (ackInput) {
    ackInput.addEventListener('input', function () {
      this.value = this.value.toUpperCase().replace(/[^A-Z0-9\-]/g, '');
    });
  }

  // --- Speech-to-Text Implementation ---
  const micBtn = document.getElementById('micBtn');
  const speechStatus = document.getElementById('speechStatus');
  const descriptionField = document.getElementById('description');

  if (micBtn && descriptionField && speechStatus) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      let isRecording = false;

      recognition.onstart = () => {
        isRecording = true;
        micBtn.innerHTML = '<i class="fas fa-stop"></i> Stop Dictation';
        micBtn.style.color = '#ef4444';
        speechStatus.style.display = 'inline-block';
      };

      recognition.onresult = (event) => {
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + ' ';
          }
        }
        
        if (finalTranscript) {
          descriptionField.value = descriptionField.value + (descriptionField.value.endsWith(' ') ? '' : ' ') + finalTranscript;
          descriptionField.dispatchEvent(new Event('input'));
        }
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        if (event.error !== 'no-speech') {
          stopDictation();
        }
      };

      recognition.onend = () => {
        if(isRecording) {
            recognition.start();
        }
      };
      
      const stopDictation = () => {
          isRecording = false;
          recognition.stop();
          micBtn.innerHTML = '<i class="fas fa-microphone"></i> Start Dictation';
          micBtn.style.color = '';
          speechStatus.style.display = 'none';
      }

      micBtn.addEventListener('click', () => {
        if (isRecording) {
            stopDictation();
        } else {
          try {
            recognition.start();
          } catch (e) {
            console.error(e);
          }
        }
      });
    } else {
      micBtn.style.display = 'none'; 
    }
  }

  // --- Audio Evidence Recording ---
  const startRecBtn = document.getElementById('startRecBtn');
  const stopRecBtn = document.getElementById('stopRecBtn');
  const recordingStatus = document.getElementById('recordingStatus');
  const audioPreviewBlock = document.getElementById('audioPreviewBlock');
  const audioPlayback = document.getElementById('audioPlayback');
  const clearAudioBtn = document.getElementById('clearAudioBtn');
  const audioBlobInput = document.getElementById('audioBlobInput');

  let mediaRecorder;
  let audioChunks = [];

  if (startRecBtn && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    startRecBtn.addEventListener('click', async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];

        let startTime;

        mediaRecorder.ondataavailable = e => {
          if (e.data.size > 0) audioChunks.push(e.data);
        };

        mediaRecorder.onstop = () => {
            if (audioChunks.length === 0) {
              alert('Recording failed: No microphone data captured.');
              return;
            }
            const durationSecs = Math.max(1, Math.round((Date.now() - startTime) / 1000));
            // Specifically use audio/webm without codecs string to solve Chrome blob streaming bug
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            const audioUrl = URL.createObjectURL(audioBlob);
            audioPlayback.src = audioUrl;
            audioPlayback.load(); // Intelligently force the DOM engine to mount the stream
            
            // Display manual duration safely to fix Chrome's 0:00 UI bug
            let durLabel = document.getElementById('durLabel');
            if (!durLabel) {
               durLabel = document.createElement('div');
               durLabel.id = 'durLabel';
               durLabel.style.fontSize = '12px';
               durLabel.style.fontWeight = 'bold';
               durLabel.style.color = 'var(--primary)';
               audioPreviewBlock.insertBefore(durLabel, audioPlayback.nextSibling);
            }
            const mins = Math.floor(durationSecs / 60);
            const secs = (durationSecs % 60).toString().padStart(2, '0');
            durLabel.innerHTML = `<i class="fas fa-clock"></i> Recorded length: ${mins}:${secs}`;

            audioPreviewBlock.style.display = 'flex';
            
            // Set the Blob into the hidden file input
            const file = new File([audioBlob], "voice_evidence.webm", { type: "audio/webm" });
            const dt = new DataTransfer();
            dt.items.add(file);
            audioBlobInput.files = dt.files;

            // Stop streams safely after data is processed
            if (mediaRecorder.stream) {
              mediaRecorder.stream.getTracks().forEach(t => t.stop());
            }
        };

        mediaRecorder.start(250); // Start with timeslices
        startTime = Date.now();
        startRecBtn.disabled = true;
        stopRecBtn.disabled = false;
        recordingStatus.style.display = 'inline';
        audioPreviewBlock.style.display = 'none';

      } catch (err) {
        console.error('Microphone access error:', err);
        alert('Could not access microphone.');
      }
    });

    stopRecBtn.addEventListener('click', () => {
      if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
      }
      startRecBtn.disabled = false;
      stopRecBtn.disabled = true;
      recordingStatus.style.display = 'none';
    });

    if (clearAudioBtn) {
        clearAudioBtn.addEventListener('click', () => {
            audioPreviewBlock.style.display = 'none';
            audioPlayback.src = '';
            audioBlobInput.value = ''; // clear the hidden input
            audioChunks = [];
        });
    }
  } else if (startRecBtn) {
    startRecBtn.style.display = 'none';
    stopRecBtn.style.display = 'none';
    const p = document.createElement('p');
    p.innerText = 'Audio recording is not supported on this browser.';
    p.style.color = '#ef4444';
    p.style.fontSize = '12px';
    document.querySelector('.audio-recorder-ui').appendChild(p);
  }

})();
