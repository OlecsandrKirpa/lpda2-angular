#!/bin/bash

ng extract-i18n && \
  ruby scripts/format-xml.rb locales/messages.xlf && \
  ruby scripts/xlf-translate.rb locales/messages.xlf locales/messages.en.xlf && \
  ruby scripts/format-xml.rb locales/messages.en.xlf && \
  ruby scripts/translations-check-interpolations.rb locales/messages.en.xlf && 
  ruby scripts/format-xml.rb locales/messages.xlf && \
  ruby scripts/format-xml.rb locales/messages.en.xlf