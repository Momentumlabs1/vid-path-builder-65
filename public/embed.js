(function() {
  'use strict';
  
  // Prevent multiple initializations
  if (window.FunnelEmbed) return;
  
  class FunnelEmbed {
    constructor() {
      this.initialized = false;
      this.config = null;
      this.widget = null;
      this.iframe = null;
      // Auto-detect base URL from script source or use current origin
      this.baseUrl = this.detectBaseUrl();
    }
    
    detectBaseUrl() {
      // Try to detect from current script tag
      const currentScript = document.currentScript || 
        (function() {
          const scripts = document.getElementsByTagName('script');
          return scripts[scripts.length - 1];
        })();
      
      if (currentScript && currentScript.src) {
        const url = new URL(currentScript.src);
        return `${url.protocol}//${url.host}`;
      }
      
      // Fallback to current origin
      return window.location.origin;
    }
    
    init(config) {
      if (this.initialized) return;
      
      this.config = {
        type: 'widget', // 'widget', 'modal', 'inline', 'fullscreen'
        position: 'bottom-right', // 'top-left', 'top-right', 'bottom-left', 'bottom-right'
        theme: 'dark',
        autoOpen: false,
        delay: 0,
        ...config
      };
      
      if (!this.config.funnelId) {
        console.error('FunnelEmbed: funnelId is required');
        return;
      }
      
      this.initialized = true;
      this.createWidget();
    }
    
    createWidget() {
      switch (this.config.type) {
        case 'inline':
          this.createInlineWidget();
          break;
        case 'modal':
          this.createModalWidget();
          break;
        case 'fullscreen':
          this.createFullscreenWidget();
          break;
        case 'widget':
        default:
          this.createFloatingWidget();
          break;
      }
    }
    
    createInlineWidget() {
      const container = document.getElementById(this.config.container || 'funnel-embed');
      if (!container) {
        console.error('FunnelEmbed: Container not found for inline embed');
        return;
      }
      
      const iframe = this.createIframe();
      iframe.style.width = '100%';
      iframe.style.height = this.config.height || '600px';
      iframe.style.border = 'none';
      iframe.style.borderRadius = '8px';
      
      container.appendChild(iframe);
    }
    
    createModalWidget() {
      // Create trigger button
      const button = document.createElement('button');
      button.innerHTML = this.config.buttonText || 'Funnel starten';
      button.style.cssText = `
        background: linear-gradient(135deg, rgba(147, 51, 234, 0.9), rgba(59, 130, 246, 0.9));
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(147, 51, 234, 0.3);
        ${this.config.buttonStyle || ''}
      `;
      
      button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-2px)';
        button.style.boxShadow = '0 8px 25px rgba(147, 51, 234, 0.4)';
      });
      
      button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0)';
        button.style.boxShadow = '0 4px 15px rgba(147, 51, 234, 0.3)';
      });
      
      button.addEventListener('click', () => this.openModal());
      
      // Insert button
      const container = document.getElementById(this.config.container || 'funnel-embed');
      if (container) {
        container.appendChild(button);
      } else {
        document.body.appendChild(button);
      }
    }
    
    createFloatingWidget() {
      const widget = document.createElement('div');
      widget.style.cssText = `
        position: fixed;
        ${this.getPositionStyles()}
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, rgba(147, 51, 234, 0.95), rgba(59, 130, 246, 0.95));
        border-radius: 50%;
        cursor: pointer;
        z-index: 999999;
        box-shadow: 0 4px 20px rgba(147, 51, 234, 0.4);
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 24px;
        font-weight: bold;
        backdrop-filter: blur(10px);
        border: 2px solid rgba(255, 255, 255, 0.2);
      `;
      
      widget.innerHTML = '▶';
      
      widget.addEventListener('mouseenter', () => {
        widget.style.transform = 'scale(1.1)';
        widget.style.boxShadow = '0 8px 30px rgba(147, 51, 234, 0.6)';
      });
      
      widget.addEventListener('mouseleave', () => {
        widget.style.transform = 'scale(1)';
        widget.style.boxShadow = '0 4px 20px rgba(147, 51, 234, 0.4)';
      });
      
      widget.addEventListener('click', () => this.openModal());
      
      document.body.appendChild(widget);
      this.widget = widget;
      
      // Auto-open after delay
      if (this.config.autoOpen && this.config.delay > 0) {
        setTimeout(() => this.openModal(), this.config.delay);
      }
    }
    
    createFullscreenWidget() {
      if (this.config.autoOpen) {
        this.openFullscreen();
      }
    }
    
    getPositionStyles() {
      const positions = {
        'top-left': 'top: 20px; left: 20px;',
        'top-right': 'top: 20px; right: 20px;',
        'bottom-left': 'bottom: 20px; left: 20px;',
        'bottom-right': 'bottom: 20px; right: 20px;'
      };
      return positions[this.config.position] || positions['bottom-right'];
    }
    
    createIframe() {
      const iframe = document.createElement('iframe');
      const params = new URLSearchParams();
      
      // Add URL parameters for personalization
      if (this.config.contact_name) params.append('contact_name', this.config.contact_name);
      if (this.config.contact_email) params.append('contact_email', this.config.contact_email);
      if (this.config.utm_source) params.append('utm_source', this.config.utm_source);
      if (this.config.utm_medium) params.append('utm_medium', this.config.utm_medium);
      if (this.config.utm_campaign) params.append('utm_campaign', this.config.utm_campaign);
      
      const queryString = params.toString();
      const separator = queryString ? '?' : '';
      
      iframe.src = `${this.baseUrl}/embed/${this.config.funnelId}${separator}${queryString}`;
      iframe.style.cssText = 'border: none; width: 100%; height: 100%;';
      iframe.setAttribute('allowfullscreen', 'true');
      iframe.setAttribute('allow', 'camera; microphone; autoplay; encrypted-media; fullscreen');
      
      this.iframe = iframe;
      return iframe;
    }
    
    openModal() {
      if (this.modalOpen) return;
      
      // Create modal overlay
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(5px);
        z-index: 1000000;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
      `;
      
      // Create modal container
      const modal = document.createElement('div');
      modal.style.cssText = `
        width: 90%;
        height: 90%;
        max-width: 800px;
        max-height: 600px;
        background: #000;
        border-radius: 12px;
        overflow: hidden;
        position: relative;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        transform: scale(0.9);
        transition: transform 0.3s ease;
      `;
      
      // Create close button
      const closeBtn = document.createElement('button');
      closeBtn.innerHTML = '×';
      closeBtn.style.cssText = `
        position: absolute;
        top: 10px;
        right: 15px;
        background: rgba(255, 255, 255, 0.1);
        border: none;
        color: white;
        font-size: 24px;
        width: 35px;
        height: 35px;
        border-radius: 50%;
        cursor: pointer;
        z-index: 10;
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(10px);
        transition: all 0.2s ease;
      `;
      
      closeBtn.addEventListener('mouseenter', () => {
        closeBtn.style.background = 'rgba(255, 255, 255, 0.2)';
        closeBtn.style.transform = 'scale(1.1)';
      });
      
      closeBtn.addEventListener('mouseleave', () => {
        closeBtn.style.background = 'rgba(255, 255, 255, 0.1)';
        closeBtn.style.transform = 'scale(1)';
      });
      
      closeBtn.addEventListener('click', () => this.closeModal());
      
      // Add iframe
      const iframe = this.createIframe();
      
      modal.appendChild(closeBtn);
      modal.appendChild(iframe);
      overlay.appendChild(modal);
      document.body.appendChild(overlay);
      
      // Animate in
      requestAnimationFrame(() => {
        overlay.style.opacity = '1';
        modal.style.transform = 'scale(1)';
      });
      
      this.modal = overlay;
      this.modalOpen = true;
      
      // Event listeners
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) this.closeModal();
      });
      
      document.addEventListener('keydown', this.handleEscKey.bind(this));
      
      // Send event
      this.sendEvent('funnel_opened');
    }
    
    openFullscreen() {
      const iframe = this.createIframe();
      iframe.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1000000;
        border: none;
        background: #000;
      `;
      
      document.body.appendChild(iframe);
      this.fullscreenIframe = iframe;
      this.sendEvent('funnel_opened');
    }
    
    closeModal() {
      if (!this.modalOpen) return;
      
      const overlay = this.modal;
      const modal = overlay.querySelector('div');
      
      overlay.style.opacity = '0';
      modal.style.transform = 'scale(0.9)';
      
      setTimeout(() => {
        document.body.removeChild(overlay);
        this.modal = null;
        this.modalOpen = false;
      }, 300);
      
      document.removeEventListener('keydown', this.handleEscKey.bind(this));
      this.sendEvent('funnel_closed');
    }
    
    handleEscKey(e) {
      if (e.key === 'Escape') {
        this.closeModal();
      }
    }
    
    sendEvent(eventType, data = {}) {
      // Send to parent window
      if (window.parent !== window) {
        window.parent.postMessage({
          type: `funnel_${eventType}`,
          funnelId: this.config.funnelId,
          data: data
        }, '*');
      }
      
      // Dispatch custom event
      window.dispatchEvent(new CustomEvent(`funnel_${eventType}`, {
        detail: { funnelId: this.config.funnelId, data: data }
      }));
      
      // Call callback if provided
      if (this.config[`on${eventType.charAt(0).toUpperCase() + eventType.slice(1)}`]) {
        this.config[`on${eventType.charAt(0).toUpperCase() + eventType.slice(1)}`](data);
      }
    }
  }
  
  // Initialize embed system
  const embed = new FunnelEmbed();
  
  // Auto-initialize if config is already available
  if (window.FUNNEL_EMBED_CONFIG) {
    embed.init(window.FUNNEL_EMBED_CONFIG);
  }
  
  // Expose API
  window.FunnelEmbed = {
    init: (config) => embed.init(config),
    open: () => embed.openModal(),
    close: () => embed.closeModal(),
    sendEvent: (type, data) => embed.sendEvent(type, data)
  };
  
  // Listen for postMessage events from iframe
  window.addEventListener('message', (event) => {
    // Allow messages from the embed iframe (more flexible origin checking)
    if (!event.data || typeof event.data !== 'object') return;
    
    const { type, data } = event.data;
    if (type && type.startsWith('funnel_')) {
      embed.sendEvent(type.replace('funnel_', ''), data);
    }
  });
  
  // Add additional compatibility for Framer and other platforms
  if (typeof window !== 'undefined') {
    // Ensure the embed works even in restrictive iframe environments
    try {
      if (window.top !== window.self) {
        // We're in an iframe, adjust behavior for better compatibility
        console.log('FunnelEmbed: Running in iframe environment');
      }
    } catch (e) {
      // Cross-origin iframe, which is fine
      console.log('FunnelEmbed: Cross-origin iframe detected');
    }
  }
  
})();