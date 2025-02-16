     <MapView
      // ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: startLocation?.latitude,
          longitude: startLocation?.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {/* نقطة البداية */}
        <Marker coordinate={startLocation} title="موقعي الحالي" pinColor="blue" />

        {/* نقطة الوجهة (endLocation) */}
        {endLocation && <Marker coordinate={endLocation} title="الموقع المحدد" pinColor="red" />}

        {/* خط المسار بين البداية والنهاية */}
        {endLocation && (
          <Polyline
            coordinates={[startLocation, endLocation]}
            strokeColor="blue"
            strokeWidth={3}
          />
        )}
      </MapView>