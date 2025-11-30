import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { BatchRegistrationForm } from './components/BatchRegistrationForm';
import { TraceabilityViewer } from './components/TraceabilityViewer';
import {
  Block,
  HerbBatch,
  FinalProduct,
  Transaction,
  CollectionData,
  FormulationData,
  TransactionType,
  ProcessingData,
  User,
  UserRole,
} from './types';
import { createBlock, createGenesisBlock } from './services/blockchainService';
import { ProductFormulationForm } from './components/ProductFormulationForm';
import { ProcessingForm } from './components/ProcessingForm';
import { WelcomeModal } from './components/WelcomeModal';
import { SmartLabelViewer } from './components/SmartLabelViewer';
import { Login } from './components/Login';
import { Scanner } from './components/Scanner';
import { QrCodeModal } from './components/QrCodeModal';
import { useLanguage } from './contexts/LanguageContext';

type View =
  | { name: 'dashboard' }
  | { name: 'newBatch' }
  | { name: 'newProduct' }
  | { name: 'processBatch'; batchId: string }
  | { name: 'trace'; item: HerbBatch | FinalProduct }
  | { name: 'smartLabel'; item: HerbBatch | FinalProduct }
  | { name: 'scan' };

type ConsumerView = 
  | { name: 'scan' }
  | { name: 'label'; item: HerbBatch | FinalProduct };

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<View>({ name: 'dashboard' });
  const [consumerView, setConsumerView] = useState<ConsumerView>({ name: 'scan' });
  const [chain, setChain] = useState<Block[]>([]);
  const [batches, setBatches] = useState<HerbBatch[]>([]);
  const [products, setProducts] = useState<FinalProduct[]>([]);
  const [showWelcome, setShowWelcome] = useState<boolean>(false);
  const [itemForQr, setItemForQr] = useState<HerbBatch | FinalProduct | null>(null);
  const { t } = useLanguage();

  const handleLogin = useCallback(async (username: string, role: UserRole) => {
    const genesisBlock = await createGenesisBlock();
    setChain([genesisBlock]);
    setCurrentUser({ name: username, role });

    if (role === UserRole.FARMER) {
      setShowWelcome(true);
      setView({ name: 'dashboard' });
    } else {
      setConsumerView({ name: 'scan' });
    }
  }, []);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    setView({ name: 'dashboard' });
    setChain([]);
    setBatches([]);
    setProducts([]);
    setShowWelcome(false);
  }, []);

  const addBlockToChain = useCallback(async (transaction: Transaction): Promise<Block> => {
    const previousBlock = chain[chain.length - 1];
    const newBlock = await createBlock(transaction, previousBlock);
    setChain(prevChain => [...prevChain, newBlock]);
    return newBlock;
  }, [chain]);

  const handleRegisterBatch = async (data: Omit<CollectionData, 'collectionDate'>) => {
    // Simulated server-side validation
    if (!data.herbName.trim() || !data.collector.trim() || data.quantity <= 0 || !data.location) {
        alert(t('app.invalidBatchData'));
        return;
    }

    const transaction: Transaction = {
      type: TransactionType.COLLECTION,
      data: { ...data, collectionDate: new Date().toISOString() },
    };
    const newBlock = await addBlockToChain(transaction);
    const newBatch: HerbBatch = {
      id: newBlock.id,
      herbName: data.herbName,
      status: 'Collected',
      history: [newBlock.id],
      currentOwner: data.collector,
    };
    setBatches(prevBatches => [...prevBatches, newBatch]);
    setView({ name: 'dashboard' });
  };

  const handleProcessBatch = async (batchId: string, data: Omit<ProcessingData, 'processDate'>) => {
     // Simulated server-side validation
    if (!data.processor.trim() || !data.processType.trim() || data.outputQuantity <= 0) {
        alert(t('app.invalidProcessingData'));
        return;
    }
    const transaction: Transaction = {
      type: TransactionType.PROCESSING,
      data: { ...data, processDate: new Date().toISOString() },
      batchId: batchId
    };
    const newBlock = await addBlockToChain(transaction);
    setBatches(prevBatches =>
      prevBatches.map(b =>
        b.id === batchId
          ? { ...b, status: data.processType, history: [...b.history, newBlock.id], currentOwner: data.processor }
          : b
      )
    );
    setView({ name: 'dashboard' });
  };
  
  const handleFormulateProduct = async (data: Omit<FormulationData, 'formulationDate'>) => {
    // Simulated server-side validation
    if (!data.productName.trim() || !data.manufacturer.trim() || data.inputBatchIds.length === 0) {
        alert(t('app.invalidFormulationData'));
        return;
    }

    const transaction: Transaction = {
      type: TransactionType.FORMULATION,
      data: { ...data, formulationDate: new Date().toISOString() },
    };
    const newBlock = await addBlockToChain(transaction);

    const newProduct: FinalProduct = {
      id: newBlock.id,
      productName: data.productName,
      manufacturer: data.manufacturer,
      history: [newBlock.id, ...data.inputBatchIds.flatMap(id => batches.find(b => b.id === id)?.history || [])],
      inputBatchIds: data.inputBatchIds
    };

    setProducts(prevProducts => [...prevProducts, newProduct]);
    setView({ name: 'dashboard' });
  };

  const handleScanSuccess = useCallback((decodedText: string) => {
    try {
        const data = JSON.parse(decodedText);
        if (data.type !== 'ayurchain-item' || !data.id) {
            alert(t('app.invalidQr'));
            if (currentUser?.role === UserRole.FARMER) setView({ name: 'dashboard' });
            return;
        }

        const allItems: (HerbBatch | FinalProduct)[] = [...batches, ...products];
        const foundItem = allItems.find(item => item.id === data.id);

        if (foundItem) {
            if (currentUser?.role === UserRole.CONSUMER) {
              setConsumerView({ name: 'label', item: foundItem });
            } else {
              setView({ name: 'smartLabel', item: foundItem });
            }
        } else {
            alert(t('app.itemNotFound', {id: data.id}));
            if (currentUser?.role === UserRole.FARMER) setView({ name: 'dashboard' });
        }

    } catch (error) {
        alert(t('app.parseError'));
        if (currentUser?.role === UserRole.FARMER) setView({ name: 'dashboard' });
    }
  }, [batches, products, currentUser, t]);


  const renderFarmerView = () => {
    switch (view.name) {
      case 'newBatch':
        return <BatchRegistrationForm onSubmit={handleRegisterBatch} onBack={() => setView({ name: 'dashboard' })} />;
      case 'newProduct':
        return <ProductFormulationForm availableBatches={batches} onSubmit={handleFormulateProduct} onBack={() => setView({ name: 'dashboard' })} />;
      case 'processBatch':
        const batchToProcess = batches.find(b => b.id === view.batchId);
        if (!batchToProcess) return <div>Batch not found</div>;
        return <ProcessingForm batch={batchToProcess} onSubmit={(data) => handleProcessBatch(view.batchId, data)} onBack={() => setView({ name: 'dashboard' })} />;
      case 'trace':
        return <TraceabilityViewer item={view.item} chain={chain} allBatches={batches} onBack={() => setView({ name: 'dashboard' })} />;
      case 'smartLabel':
        return <SmartLabelViewer item={view.item} chain={chain} onBack={() => setView({ name: 'dashboard' })} userRole={currentUser!.role} />;
      case 'scan':
      case 'dashboard':
      default:
        return (
          <Dashboard
            batches={batches}
            products={products}
            onRegisterBatch={() => setView({ name: 'newBatch' })}
            onFormulateProduct={() => setView({ name: 'newProduct' })}
            onViewTrace={item => setView({ name: 'trace', item })}
            onProcessBatch={batchId => setView({ name: 'processBatch', batchId })}
            onViewSmartLabel={item => setView({ name: 'smartLabel', item })}
            onShowQrCode={item => setItemForQr(item)}
          />
        );
    }
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  // Consumer View
  if (currentUser.role === UserRole.CONSUMER) {
    return (
      <div className="min-h-screen font-sans text-gray-800 bg-black">
        <Header 
            currentUser={currentUser.name} 
            onLogout={handleLogout} 
            onScanRequest={() => {}} 
            isConsumer
        />
        {consumerView.name === 'scan' && (
           <Scanner 
              onScanSuccess={handleScanSuccess} 
              onCancel={handleLogout}
              cancelButtonText={t('scanner.logoutButton')}
            />
        )}
        {consumerView.name === 'label' && (
          <main className="container mx-auto p-4 md:p-8 bg-brand-cream-light">
            <SmartLabelViewer
              item={consumerView.item}
              chain={chain}
              onBack={() => setConsumerView({ name: 'scan' })}
              userRole={currentUser.role}
            />
          </main>
        )}
      </div>
    );
  }

  // Farmer / Admin View
  return (
    <div className="min-h-screen bg-brand-cream-light font-sans text-gray-800">
       {showWelcome && <WelcomeModal onClose={() => setShowWelcome(false)} />}
      <Header currentUser={currentUser.name} onLogout={handleLogout} onScanRequest={() => setView({ name: 'scan' })} />
      <main className="container mx-auto p-4 md:p-8">
        {renderFarmerView()}
      </main>
      {view.name === 'scan' && (
        <Scanner 
            onScanSuccess={handleScanSuccess} 
            onCancel={() => setView({ name: 'dashboard' })} 
        />
      )}
      {itemForQr && (
        <QrCodeModal 
            item={itemForQr} 
            onClose={() => setItemForQr(null)} 
        />
      )}
    </div>
  );
};

export default App;
